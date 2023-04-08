const catchAsync = <T extends () => Promise<any> | any>(func: T) => {
  return () => {
    return func().catch((err: any) =>
      console.log('🎇🎇🎇', err.message || 'Something went wrong')
    );
  };
};

export { catchAsync };
