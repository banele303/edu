import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";


export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const email = params.email as string;
        const role = email === "alexsouthflow@gmail.com" ? "admin" : ((params.role as string) || "student");
        const studentClass = typeof params.studentClass === "string" && params.studentClass !== ""
          ? params.studentClass
          : undefined;
        const teacherSubject = Array.isArray(params.teacherSubject) && params.teacherSubject.length > 0
          ? params.teacherSubject
          : undefined;

        return {
          email,
          name: params.name as string,
          role,
          isActive: true,
          studentClass: studentClass as any,
          teacherSubject: teacherSubject as any,
        };
      },
    }),
  ],
});
