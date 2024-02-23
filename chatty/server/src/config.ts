import dotenv from 'dotenv';

dotenv.config();

/*
// BELOW IS THE CORRECT VERSION OF THIS
type UppercaseKeys<T> = {
  [K in keyof T as Uppercase<K> extends K ? K : never]: K;
};
*/

type UppercaseKeys<T> = {
  [K in keyof T as K extends string
    ? Uppercase<K> extends K
      ? K // here 'K' also should be only uppercase
      : never
    : never]: never; // only need to set the keys, no need to set the values to set the values to never
};
type Props = keyof UppercaseKeys<Config>;

class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.NODE_ENV = process.env.NODE_ENV;
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE;
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO;

    this.required('*');
  }

  private required(props: '*' | Props[]) {
    if (props === '*') {
      props = Object.keys(this).filter(
        key => key === key.toUpperCase()
      ) as Props[];
    }

    const emptyProps = props.filter(prop => !this[prop]);

    if (emptyProps.length) {
      throw new Error(
        `These environment variables should be present: '${emptyProps.join(
          ', '
        )}'`
      );
    }
  }
}

export const config = new Config();
