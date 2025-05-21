// deno-lint-ignore-file
import { AxiosError, AxiosResponse } from "npm:axios";
import { Request } from "npm:express";
import { Print } from "./output/Print.ts";

const print = new Print();

export enum CurlMethod {
  axios = "axios",
  express = "express",
}

export interface ICurl {
  method?: string;
  url?: string;
  data?: Object | "string";
  headers: Record<string, string>;
}

export class Curl {
  method?: ICurl["method"];
  url?: ICurl["url"];
  data?: ICurl["data"];
  headers: ICurl["headers"];

  constructor(config: ICurl) {
    this.method = config.method;
    this.url = config.url;
    this.data = config.data;
    this.headers = config.headers;
  }

  getBody() {
    if (
      typeof this.data !== "undefined" &&
      this.data !== "" &&
      Object.keys(this.data).length &&
      this?.method?.toUpperCase() !== "GET"
    ) {
      let body = "";

      if (this?.headers?.["Content-Type"] === "application/json") {
        body = `--data '${this.data}'`;
      } else {
        for (const [key, value] of Object.entries(this.data)) {
          body += `--data-urlencode '${key}=${value}' `;
        }
      }

      return body.trim();
    } else {
      return "";
    }
  }

  getUrlEncoded(): string {
    return this.url as string;
  }

  formatCurlHeaders(headers: Record<string, string>): string {
    return Object.entries(headers)
      .filter(([key]) => key.toLowerCase() !== "content-length")
      .map(([key, value]) => `-H "${key}: ${value}"`)
      .join(" ");
  }

  getCommand() {
    let contentType = "application/json";

    if (this.headers["Content-Type"]) {
      contentType = this.headers["Content-Type"];
    }
    if (this.headers["content-type"]) {
      contentType = this.headers["content-type"];
    }

    const command =
      `curl -H 'Content-Type: ${contentType}' -X ${this.method} '${this.getUrlEncoded()}'`;

    return command.trim();
  }

  formatFullCurl() {
    const curlHeaders = this.formatCurlHeaders(this.headers);
    const command = `curl ${curlHeaders} -X ${this.method} ${
      this.data ? `-d '${this.data}'` : ""
    } '${this.getUrlEncoded()}'`;

    return command.trim();
  }
}

export function generateAxiosCurl(
  response: AxiosResponse | AxiosError,
  method?: string,
): string {
  const isSuccessResponse = (response as AxiosResponse)?.headers &&
    (response as AxiosResponse)?.status &&
    Number((response as AxiosResponse)?.status) < 300 &&
    Number((response as AxiosResponse)?.status) > 100;

  const requestMethod = isSuccessResponse
    ? method ?? (response as AxiosResponse)?.config.method
    : method ?? (response as AxiosError).response?.config.method;
  const headers = isSuccessResponse
    ? (response as AxiosResponse)?.headers ??
      (response as AxiosResponse)?.config.headers
    : (response as AxiosError).response?.headers ??
      (response as AxiosError).config?.headers;
  const url = isSuccessResponse
    ? (response as AxiosResponse)?.config.url
    : (response as AxiosError).response?.config.url;
  const data = isSuccessResponse
    ? (response as AxiosResponse)?.config.data
    : (response as AxiosError).response?.data;

  // @ts-ignore
  const curl = new Curl({ method: requestMethod, url, data, headers });

  return curl.getCommand();
}

export const generateFullCurl = (
  response: Request | AxiosResponse | AxiosError,
  curlMethod: CurlMethod,
  options?: {
    method?: string;
    skipSuccessValidation?: boolean;
  },
) => {
  if (curlMethod === CurlMethod.axios) {
    const isSuccessResponse = options?.skipSuccessValidation ||
      ((response as AxiosResponse)?.headers &&
        (response as AxiosResponse)?.status &&
        Number((response as AxiosResponse)?.status) < 599 &&
        Number((response as AxiosResponse)?.status) > 100);

    const requestMethod = isSuccessResponse
      ? options?.method ?? (response as AxiosResponse)?.config.method
      : options?.method ?? (response as AxiosError).response?.config.method;

    const headers = isSuccessResponse
      ? (response as AxiosResponse)?.config?.headers ??
        (response as AxiosResponse)?.headers
      : (response as AxiosError).config?.headers ??
        (response as AxiosError)?.response?.headers;

    const data = isSuccessResponse
      ? (response as AxiosResponse)?.config?.data
      : (response as AxiosError).response?.config?.data;

    let url = isSuccessResponse
      ? (response as AxiosResponse)?.config.baseURL ?? ""
      : (response as AxiosError).response?.config.baseURL;

    if (!url) {
      url = isSuccessResponse
        ? (response as AxiosResponse)?.config.url
        : (response as AxiosError).response?.config.url;
    }

    print.info("Curl request", { requestMethod, url, data, headers });
    // @ts-ignore
    const curl = new Curl({ method: requestMethod, url, data, headers });

    return curl.formatFullCurl();
  }

  if (curlMethod === CurlMethod.express) {
    const requestMethod = (response as Request)?.method;
    const headers = (response as Request)?.headers;
    const url = (response as Request)?.protocol +
      "://" +
      (response as Request).get("host") +
      (response as Request)?.originalUrl;
    const data = (response as Request)?.body;

    const dataJson = JSON.stringify(data);
    // @ts-ignore
    const curl = new Curl({
      method: requestMethod,
      url,
      data: dataJson,
      headers,
    });

    return curl.formatFullCurl();
  }
};
