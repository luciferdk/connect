declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        mobile: string;
        bio: string | null;
        profileUrl: string | null;
      };
    }
  }
}

export {};
