declare global {
  namespace Express {
    interface Request {
      userId?: string; // 👈 add your custom field here
    }
  }
}

export {}; // required to make this a module
