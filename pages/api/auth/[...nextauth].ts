import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    /**
     * 環境変数でサインイン可能なユーザーを制限する
     * 管理用アカウントしかサインインできなくすること
     */
    async signIn({ account, profile }) {
      const signupAllowedEmailsArray =
        process.env.SIGNIN_ALLOWED_EMAILS!.split(',');
      if (account && account?.provider === 'google') {
        return profile?.email
          ? signupAllowedEmailsArray.includes(profile.email)
          : false;
      }
      return false;
    },
  },
};
const nextAuth = NextAuth(authOptions);
export default nextAuth;
