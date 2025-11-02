declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
	nickName: string;
        mobile: string;
        bio: string | null;
        profileUrl: string | null;
      };
    }
  }
}

export {};
