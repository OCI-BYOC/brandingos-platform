import { AbstractFulfillmentProviderService, MedusaError } from "@medusajs/framework/utils"
import {
  CalculatedShippingOptionPrice,
  CreateFulfillmentResult,
  CreateShippingOptionDTO,
  FulfillmentItemDTO,
  FulfillmentOrderDTO,
  FulfillmentOption,
} from "@medusajs/framework/types"

type EasyShipOptions = {
  api_key?: string
  account_id?: string
  base_url?: string
}

/**
 * EasyShip fulfillment provider for global shipping (250+ countries).
 * Gives sellers access to 550+ courier services, real-time rates, DDP/DDU.
 *
 * Required env vars: EASYSHIP_API_KEY, EASYSHIP_ACCOUNT_ID
 * Docs: https://developers.easyship.com/
 */
class EasyShipFulfillmentProvider extends AbstractFulfillmentProviderService {
  static identifier = "easyship"

  protected options_: EasyShipOptions

  constructor(container: Record<string, unknown>, options: EasyShipOptions) {
    super()
    this.options_ = {
      base_url: "https://api.easyship.com/v2",
      ...options,
    }
  }

  static validateOptions(options: Record<string, unknown>): void {
    if (!options.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "EASYSHIP_API_KEY is required for EasyShip fulfillment"
      )
    }
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
      { id: "easyship-express", name: "Express International (3–5 days)", type: "express" },
      { id: "easyship-standard", name: "Standard International (10–15 days)", type: "standard" },
      { id: "easyship-economy", name: "Economy International (15–21 days)", type: "economy" },
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
    const shipmentPayload = {
      destination_country_alpha2: order?.shipping_address?.country_code?.toUpperCase() ?? "US",
      destination_postal_code: order?.shipping_address?.postal_code ?? "",
      destination_city: order?.shipping_address?.city ?? "",
      destination_name: `${order?.shipping_address?.first_name ?? ""} ${order?.shipping_address?.last_name ?? ""}`.trim(),
      destination_address_line_1: order?.shipping_address?.address_1 ?? "",
      destination_phone_number: order?.shipping_address?.phone ?? "",
      items: items.map((item) => ({
        description: (item as Record<string, unknown>).title ?? "Product",
        quantity: item.quantity ?? 1,
        actual_weight: (data as Record<string, number>).weight ?? 0.5,
        height: (data as Record<string, number>).height ?? 10,
        width: (data as Record<string, number>).breadth ?? 10,
        length: (data as Record<string, number>).length ?? 10,
        declared_currency: "USD",
        declared_customs_value: 10,
      })),
      output_currency: "USD",
      incoterms: "DDU",
    }

    const res = await fetch(`${this.options_.base_url}/shipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.options_.api_key}`,
        "easyship-account-id": this.options_.account_id ?? "",
      },
      body: JSON.stringify(shipmentPayload),
    })

    const result = await res.json() as Record<string, unknown>

    return {
      data: {
        easyship_shipment_id: result.shipment_id,
        tracking_number: result.tracking_number,
        tracking_url: result.tracking_page_url,
        courier_name: result.courier_name,
        label_url: result.label_url,
      },
      labels: result.label_url
        ? [{ tracking_number: result.tracking_number as string ?? "", tracking_url: result.tracking_page_url as string ?? "", label_url: result.label_url as string }]
        : [],
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
  services: [EasyShipFulfillmentProvider],
}
