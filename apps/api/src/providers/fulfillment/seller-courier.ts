import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import {
  CalculatedShippingOptionPrice,
  CreateFulfillmentResult,
  CreateShippingOptionDTO,
  FulfillmentItemDTO,
  FulfillmentOrderDTO,
  FulfillmentOption,
} from "@medusajs/framework/types"

type SellerCourierOptions = {
  webhook_timeout_ms?: number
}

/**
 * Bring-Your-Own-Courier (BYOC) fulfillment provider.
 * Sellers who have their own courier (Delhivery, FedEx contract, etc.) can
 * configure a webhook URL in their store settings. BrandingOS will POST order
 * details to that URL when fulfillment is created.
 *
 * The seller's webhook receives a JSON payload and responds with:
 * { tracking_number, tracking_url, courier_name }
 *
 * Configure webhook URL per-seller in the Seller module settings.
 */
class SellerCourierFulfillmentProvider extends AbstractFulfillmentProviderService {
  static identifier = "seller-courier"

  protected options_: SellerCourierOptions

  constructor(container: Record<string, unknown>, options: SellerCourierOptions) {
    super()
    this.options_ = { webhook_timeout_ms: 10000, ...options }
  }

  async canCalculate(_data: CreateShippingOptionDTO): Promise<boolean> {
    return true
  }

  async calculatePrice(
    _optionData: Record<string, unknown>,
    _data: Record<string, unknown>,
    _context: Record<string, unknown>
  ): Promise<CalculatedShippingOptionPrice> {
    return { calculated_amount: 0, is_calculated_price_tax_inclusive: false }
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return [
      { id: "seller-courier-custom", name: "Seller's Own Courier", type: "custom" },
    ]
  }

  async validateFulfillmentData(
    _optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    _context: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return data
  }

  async validateOption(data: Record<string, unknown>): Promise<boolean> {
    return !!data.id
  }

  async createFulfillment(
    data: Record<string, unknown>,
    items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[],
    order: Partial<FulfillmentOrderDTO> | undefined,
    _fulfillment: Record<string, unknown>
  ): Promise<CreateFulfillmentResult> {
    const webhookUrl = (data as Record<string, string>).webhook_url

    if (!webhookUrl) {
      return {
        data: { status: "pending_webhook_config", message: "Seller must configure courier webhook URL in store settings" },
        labels: [],
      }
    }

    const payload = {
      event: "fulfillment.created",
      order_id: order?.id,
      shipping_address: order?.shipping_address,
      items: items.map((item) => ({
        id: (item as Record<string, unknown>).id,
        title: (item as Record<string, unknown>).title,
        quantity: item.quantity,
        sku: (item as Record<string, unknown>).sku,
      })),
      dimensions: {
        weight_kg: (data as Record<string, number>).weight,
        length_cm: (data as Record<string, number>).length,
        breadth_cm: (data as Record<string, number>).breadth,
        height_cm: (data as Record<string, number>).height,
      },
      metadata: (data as Record<string, unknown>).metadata,
    }

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), this.options_.webhook_timeout_ms)

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!res.ok) {
        return {
          data: { status: "webhook_error", code: res.status, webhook_url: webhookUrl },
          labels: [],
        }
      }

      const result = await res.json() as Record<string, unknown>

      return {
        data: {
          tracking_number: result.tracking_number,
          tracking_url: result.tracking_url,
          courier_name: result.courier_name ?? "Seller Courier",
          webhook_url: webhookUrl,
        },
        labels: [],
      }
    } catch (err) {
      return {
        data: { status: "webhook_timeout", webhook_url: webhookUrl, error: (err as Error).message },
        labels: [],
      }
    }
  }

  async cancelFulfillment(_data: Record<string, unknown>): Promise<void> {
    return
  }

  async createReturnFulfillment(_fromData: Record<string, unknown>): Promise<CreateFulfillmentResult> {
    return { data: {}, labels: [] }
  }

  async getFulfillmentDocuments(_data: Record<string, unknown>): Promise<never[]> {
    return []
  }

  async getReturnDocuments(_data: Record<string, unknown>): Promise<never[]> {
    return []
  }

  async getShipmentDocuments(_data: Record<string, unknown>): Promise<never[]> {
    return []
  }

  async retrieveDocuments(
    _fulfillmentData: Record<string, unknown>,
    _documentType: string
  ): Promise<void> {
    return
  }
}

export default {
  services: [SellerCourierFulfillmentProvider],
}
