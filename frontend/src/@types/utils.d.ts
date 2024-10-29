type Overwrite<T, R> = Omit<T, keyof R> & R;
