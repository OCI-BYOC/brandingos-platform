import { AbstractFulfillmentProviderService, MedusaError } from "@medusajs/framework/utils"
import {
  CalculatedShippingOptionPrice,
  CreateFulfillmentResult,
  CreateShippingOptionDTO,
  FulfillmentItemDTO,
  FulfillmentOrderDTO,
  FulfillmentOption,
} from "@medusajs/framework/types"

type ShipRocketOptions = {
  email?: string
  password?: string
  base_url?: string
}

type ShipRocketOrderData = {
  order_id?: string
  shipment_id?: string
  awb_code?: string
  tracking_url?: string
  courier_name?: string
}

/**
 * ShipRocket fulfillment provider for Indian domestic + international shipping.
 * Sellers picking this provider get access to 25+ courier partners through one API.
 *
 * Required env vars: SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD
 * Docs: https://apidocs.shiprocket.in/
 */
class ShipRocketFulfillmentProvider extends AbstractFulfillmentProviderService {
  static identifier = "shiprocket"

  protected options_: ShipRocketOptions
  protected authToken_: string | null = null
  protected tokenExpiry_: number = 0

  constructor(container: Record<string, unknown>, options: ShipRocketOptions) {
    super()
    this.options_ = {
      base_url: "https://apiv2.shiprocket.in/v1/external",
      ...options,
    }
  }

  static validateOptions(options: Record<string, unknown>): void {
    if (!options.email || !options.password) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD are required for ShipRocket fulfillment"
      )
    }
  }

  private async getToken(): Promise<string> {
    if (this.authToken_ && Date.now() < this.tokenExpiry_) return this.authToken_

    const res = await fetch(`${this.options_.base_url}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: this.options_.email, password: this.options_.password }),
    })

    if (!res.ok) throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, "ShipRocket auth failed")

    const data = await res.json() as { token: string }
    this.authToken_ = data.token
    this.tokenExpiry_ = Date.now() + 23 * 60 * 60 * 1000
    return this.authToken_
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
      { id: "shiprocket-standard", name: "Standard (5–7 days)", type: "standard" },
      { id: "shiprocket-express", name: "Express (2–3 days)", type: "express" },
      { id: "shiprocket-same-day", name: "Same Day Delivery", type: "same_day" },
      { id: "shiprocket-international", name: "International Shipping", type: "international" },
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
    const token = await this.getToken()

    const orderPayload = {
      order_id: `BOS-${Date.now()}`,
      order_date: new Date().toISOString().split("T")[0],
      pickup_location: "BrandingOS Warehouse",
      billing_customer_name: order?.shipping_address?.first_name ?? "Customer",
      billing_last_name: order?.shipping_address?.last_name ?? "",
      billing_address: order?.shipping_address?.address_1 ?? "",
      billing_city: order?.shipping_address?.city ?? "",
      billing_pincode: order?.shipping_address?.postal_code ?? "000000",
      billing_state: order?.shipping_address?.province ?? "",
      billing_country: order?.shipping_address?.country_code?.toUpperCase() ?? "IN",
      billing_email: order?.email ?? "",
      billing_phone: order?.shipping_address?.phone ?? "9999999999",
      shipping_is_billing: true,
      order_items: items.map((item) => ({
        name: (item as Record<string, unknown>).title ?? "Product",
        selling_price: 0,
        units: item.quantity ?? 1,
        sku: (item as Record<string, unknown>).sku ?? "SKU",
      })),
      payment_method: "Prepaid",
      sub_total: 0,
      length: (data as Record<string, number>).length ?? 10,
      breadth: (data as Record<string, number>).breadth ?? 10,
      height: (data as Record<string, number>).height ?? 10,
      weight: (data as Record<string, number>).weight ?? 0.5,
    }

    const res = await fetch(`${this.options_.base_url}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    })

    const result = await res.json() as ShipRocketOrderData

    return {
      data: {
        shiprocket_order_id: result.order_id,
        shiprocket_shipment_id: result.shipment_id,
        awb_code: result.awb_code,
        tracking_url: result.tracking_url,
        courier_name: result.courier_name,
      },
      labels: [],
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
  services: [ShipRocketFulfillmentProvider],
}
