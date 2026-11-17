import {
  AbstractPaymentProvider,
  PaymentSessionStatus,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  ProviderWebhookPayload,
  WebhookActionResult,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
} from "@medusajs/framework/types"
import Razorpay from "razorpay"
import crypto from "crypto"

type RazorpayOptions = {
  key_id: string
  key_secret: string
  webhook_secret: string
}

class RazorpayPaymentProvider extends AbstractPaymentProvider<RazorpayOptions> {
  static identifier = "razorpay"

  protected razorpay: InstanceType<typeof Razorpay>
  protected options_: RazorpayOptions

  constructor(container: Record<string, unknown>, options: RazorpayOptions) {
    super(container, options)
    this.options_ = options
    this.razorpay = new Razorpay({
      key_id: options.key_id,
      key_secret: options.key_secret,
    })
  }

  static validateOptions(options: Record<string, unknown>): void {
    if (!options.key_id) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "RAZORPAY_KEY_ID is required")
    }
    if (!options.key_secret) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "RAZORPAY_KEY_SECRET is required")
    }
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, context } = input

    const order = await this.razorpay.orders.create({
      amount: Math.round(Number(amount)),
      currency: currency_code.toUpperCase(),
      receipt: `bos_${Date.now()}`,
      notes: {
        customer_email: context?.customer?.email ?? "",
        customer_id: context?.customer?.id ?? "",
      },
    })

    return {
      id: order.id,
      data: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        receipt: order.receipt,
      },
    }
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    const data = (input.data ?? {}) as Record<string, string>
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = data

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return {
        status: PaymentSessionStatus.PENDING,
        data: input.data,
      }
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac("sha256", this.options_.key_secret)
      .update(body)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return {
        status: PaymentSessionStatus.ERROR,
        data: { ...input.data, error: "Signature mismatch" },
      }
    }

    return {
      status: PaymentSessionStatus.AUTHORIZED,
      data: {
        ...input.data,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      },
    }
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    const paymentId = input.data?.razorpay_payment_id as string | undefined
    if (!paymentId) return { data: input.data }

    const payment = await this.razorpay.payments.fetch(paymentId)
    if (payment.status !== "captured") {
      await this.razorpay.payments.capture(paymentId, payment.amount as number, payment.currency as string)
    }

    return { data: { ...input.data, captured: true } }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return { data: { ...input.data, cancelled: true } }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: input.data }
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    const paymentId = input.data?.razorpay_payment_id as string | undefined
    if (!paymentId) return { status: PaymentSessionStatus.PENDING }

    try {
      const payment = await this.razorpay.payments.fetch(paymentId)
      switch (payment.status) {
        case "captured":
          return { status: PaymentSessionStatus.AUTHORIZED }
        case "failed":
          return { status: PaymentSessionStatus.ERROR }
        case "refunded":
          return { status: PaymentSessionStatus.CANCELED }
        default:
          return { status: PaymentSessionStatus.PENDING }
      }
    } catch {
      return { status: PaymentSessionStatus.ERROR }
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const paymentId = input.data?.razorpay_payment_id as string | undefined
    if (!paymentId) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "No payment ID for refund")
    }

    const refund = await this.razorpay.payments.refund(paymentId, {
      amount: Math.round(Number(input.amount)),
    })

    return { data: { ...input.data, refund_id: refund.id } }
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    const orderId = input.data?.id as string | undefined
    if (!orderId) return { data: input.data }

    const order = await this.razorpay.orders.fetch(orderId)
    return { data: { ...input.data, ...order } }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    const { amount, currency_code, data } = input
    const orderId = (data as Record<string, string> | undefined)?.id

    if (!orderId || amount === undefined) {
      return this.initiatePayment({
        amount,
        currency_code,
        data: {},
      } as InitiatePaymentInput)
    }

    return { data: data as Record<string, unknown> }
  }

  async getWebhookActionAndData(
    webhookData: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const { data, rawData, headers } = webhookData
    const signature = headers["x-razorpay-signature"] as string

    if (this.options_.webhook_secret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", this.options_.webhook_secret)
        .update(rawData as string)
        .digest("hex")

      if (expectedSignature !== signature) {
        return { action: "not_supported" }
      }
    }

    const event = data.event as string
    const paymentEntity = (data.payload as Record<string, Record<string, unknown>>)?.payment?.entity as Record<string, unknown>
    const notes = paymentEntity?.notes as Record<string, unknown> | undefined

    switch (event) {
      case "payment.captured":
        return {
          action: "authorized",
          data: {
            session_id: notes?.session_id as string,
            amount: paymentEntity?.amount as number,
          },
        }
      case "payment.failed":
        return {
          action: "failed",
          data: {
            session_id: notes?.session_id as string,
            amount: paymentEntity?.amount as number,
          },
        }
      default:
        return { action: "not_supported" }
    }
  }
}

export default RazorpayPaymentProvider
