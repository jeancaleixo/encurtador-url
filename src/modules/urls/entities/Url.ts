import { randomUUID } from 'crypto';
import { Replace } from 'src/common/replace';

interface UrlSchema {
  longUrl: string;
  shortenedUrl: string;
  userId?: string | null;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class Url {
  private props: UrlSchema;
  private _id: string;

  constructor(
    props: Replace<
      UrlSchema,
      {
        createdAt?: Date;
        updatedAt?: Date;
        deletedAt?: Date | null;
        clicks?: number;
      }
    >,
    id?: string,
  ) {
    this.props = {
      ...props,
      clicks: props.clicks ?? 0,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
      deletedAt: props.deletedAt || null,
    };
    this._id = id || randomUUID();
  }

  get id(): string {
    return this._id;
  }

  get longUrl(): string {
    return this.props.longUrl;
  }

  set longUrl(value: string) {
    this.props.longUrl = value;
  }

  get shortenedUrl(): string {
    return this.props.shortenedUrl;
  }

  get userId(): string | null | undefined {
    return this.props.userId;
  }

  get clicks(): number {
    return this.props.clicks;
  }

  set clicks(value: number) {
    this.props.clicks = value;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  set updatedAt(value: Date) {
    this.props.updatedAt = value;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  set deletedAt(value: Date | null) {
    this.props.deletedAt = value;
  }
}
