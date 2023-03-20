import { AxiosPromise, AxiosResponse } from "axios";

interface ModelAttributes<T> {
  set(update: T): void;
  getAll(): T;
  get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {
  fetch(id: number): AxiosPromise;
  save(data: T): AxiosPromise
}

interface Events {
  on(eventName: string, cb: () => void): void;
  trigger(eventName: string): void
}

export interface HasId {
  id?: number
}

export class Model<T extends HasId> {
  constructor(
    private attributes: ModelAttributes<T>,
    private events: Events,
    private sync: Sync <T>
  ) {}

  // get on() {
  //   return this.events.on;
  // }

  on = this.events.on; // this is the same as the above commented method
  trigger = this.events.trigger
  get = this.attributes.get;
  // also, using this way of assigning methods to properties will only work if we dont create the "event" or "attribute" objects
  // inside the constructor. it will only work if we only pass the already created object of these into the constructor
  set(update: T): void {
    this.attributes.set(update)
    this.events.trigger('change')
  }

  fetch(): void {
    const id = this.get('id');
    if(typeof id !== 'number') {
      throw new Error('Cannot fetch without an id')
    }
    this.sync
      .fetch(id)
      .then((response: AxiosResponse): void => {
        this.set(response.data)
      })
  }
  save(): void {
    this.sync
      .save(this.attributes.getAll())
      .then((res: AxiosResponse): void => {
        this.events.trigger('save')
      })
      .catch(() => {
        this.trigger('error')
      })
  }
  
}