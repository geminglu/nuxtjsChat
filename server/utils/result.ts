import type { H3Event, EventHandlerRequest } from "h3";

interface PayloadType {
  message?: string;
  data?: any;
  success: boolean;
  status: number;
}

type data = Omit<PayloadType, "success">;

export class ResultData<T> {
  constructor(event: H3Event<EventHandlerRequest>, payload: PayloadType) {
    setResponseStatus(event, payload.status);
    this.message = payload.message || "";
    this.data = payload.data ?? null;
    this.success = payload.success;
  }

  message?: string;

  data?: T;

  success: boolean;

  /**
   * 成功
   */
  static ok<T = any>(event: H3Event<EventHandlerRequest>, payload: data): ResultData<T> {
    return new ResultData(event, { ...payload, success: true });
  }

  /**
   *失败
   */
  static fail<T = any>(event: H3Event<EventHandlerRequest>, payload: data): ResultData<T> {
    return new ResultData(event, { ...payload, success: false });
  }
}
