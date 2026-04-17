import Navbar from "@/components/layout/navigation/Navbar";
import BottomNav from "@/components/layout/navigation/BottomNav";
import { FooterWrapper } from "@/components/layout/footer/FooterWrapper";
import { getUnreadCount } from "@/features/notifications";
import { getAuthUserWithRole } from "@/lib/supabase/getAuthUserWithRole";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role } = await getAuthUserWithRole();
  const unreadCount = user ? await getUnreadCount() : 0;

  return (
    <>
      <Navbar
        user={user}
        unreadCount={unreadCount}
        isAdmin={role === "admin"}
      />
      <main>{children}</main>
      <FooterWrapper />
      <BottomNav userId={user?.id} isAdmin={role === "admin"} />
    </>
  );
}

const values = (a: string, b: string): string => {
  return a + b;
};

interface UserInterface {
  id: number;
  name: string;
  age?: number;
  greet(message: string): void;
}

const User: UserInterface = {
  id: 1,
  name: "Pepe",
  greet(message) {
    console.log(message);
  },
};

type IDFieldType = string | number;

const printID = (id: IDFieldType) => {
  console.log("ID" + id);
};

interface BusinessPartner {
  name: string;
  creditScore: number;
}

interface UserIdentity {
  id: number;
  email: string;
}

type Employee = BusinessPartner & UserIdentity;

const signContract = (employee: Employee): void => {
  console.log(
    "Contract signed by " + employee.name + "with email: " + employee.email,
  );
};

signContract({
  name: "pepe",
  creditScore: 100,
  id: 34,
  email: "pepe@gmail.com",
});

interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  variant: "primary" | "secondary";
}

export function Button({ text, onClick, disabled, variant }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={styles[variant]}>
      {text}
    </button>
  );
}
