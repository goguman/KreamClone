import { NextApiHandler, NextApiRequest } from 'next';
import NextAuth from 'next-auth';
import Kakao from 'next-auth/providers/kakao';
import prisma from '../../../lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials';
import {compare} from 'bcryptjs';
import crypto from "crypto";
const authHandler: NextApiHandler = (req, res) => {
    NextAuth(req, res, options);
}
export default authHandler;



export const options = {
    providers: [
        CredentialsProvider({
            id: "email-password-credential",
            name : "Credential",
            credentials : {
                email : { label : 'Email', type: 'email'},
                password : { label : 'Password', type : 'password'}
            },
            async authorize(credentials: Record<any, any>, req: NextApiRequest){
                const user = await prisma.user.findUnique({
                    where : {
                        email : credentials.email
                    },
                    select : {
                        email : true,
                        password : true,
                        id : true
                    }
                });
                if(!user){
                    throw new Error('없는 사용자');
                }
                const isValid = await compare(credentials.password, user.password);
                if(!isValid){
                    throw new Error('잘못된 비번');
                }
                if(isValid && user ){
                    return { email : user.email, id : user.id}
                }

                return null;
            }
        }),
        Kakao({
            clientId: process.env.KAKAO_CLIENT_ID,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
        }),
        {
            id: "naver",
            name: "Naver",
            type: "oauth",
            params: {grant_type: "authorization_code"},
            authorization: "https://nid.naver.com/oauth2.0/authorize",
            token: "https://nid.naver.com/oauth2.0/token",
            userinfo: "https://openapi.naver.com/v1/nid/me",
            profile(profile) {
                return {
                    id: profile.response.id,
                    name: profile.response.nickname,
                    email: profile.response.email,
                    image: profile.response.profile_image,
                }
            },
            checks: ["state"],
            clientId: process.env.NAVER_CLIENT_ID,
            clientSecret: process.env.NAVER_CLIENT_SECRET
        },
    ],
    secret: process.env.SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 10, // 30 days
        updateAge: 10, // 24 hours
    },
    jwt: {
        secret: process.env.SECRET,
        maxAge : 10,
        encryption: true,
    },
        callbacks: {
            async jwt({ token, account, user }) {
                if (account) {
                    token.accessToken = account.access_token;
                    token.provider = account.provider;
                    token.userId = account.userId;
                }

                return token;
            },
            async session({ session, token }) {
                session.accessToken = token.accessToken;
                session.provider = token.provider;
                session.userId = token.sub;
                return session;
            },
    },
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: '/login'
    }
};

