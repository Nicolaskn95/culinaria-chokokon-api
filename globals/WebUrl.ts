import { Env } from "../config/Env.ts";

interface IURL {
  domain?: string;
  ip?: string;
  port?: string;
  protocol?: string;
  endpoint?: string;
  query?: string;
}

export class WebUrl {
  private _urlObject: URL;

  private domain?: string;
  private ip?: string;
  private port?: string;
  private protocol?: string;
  private endpoint?: string;
  private query?: string;

  constructor(url: IURL) {
    this.protocol = url.protocol;
    this.domain = url.domain;
    this.ip = url.ip;
    this.port = url.port;
    this.endpoint = url.endpoint;
    this.query = url.query;

    const protocol = this.protocol ?? (Env.isDevLike ? "http" : "https");
    const domain = this.domain ?? `${this.ip}:${this.port}`;
    const urlString = `${protocol}://${domain}${this.endpoint}`;

    this._urlObject = new URL(urlString);
    this._urlObject.search = this.query ?? "";
  }

  get fullUrl() {
    return this._urlObject.toString();
  }

  get urlObject() {
    return this._urlObject;
  }
}
