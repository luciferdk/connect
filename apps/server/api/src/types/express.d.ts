declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
	nickname: string;
        mobile: string;
        bio: string | null;
        profileUrl: string | null;
      };
    }
  }
}

export {};
