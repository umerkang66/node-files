const catchAsync = <T extends () => Promise<any> | any>(func: T) => {
  const returnedFunc = () => {
    return func().catch((err: any) =>
      console.log('🎇🎇🎇', err.message || 'Something went wrong')
    );
  };

  return returnedFunc as T;
};

export { catchAsync };
