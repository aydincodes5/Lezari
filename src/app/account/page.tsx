import { getCurrentUser } from "@/lib/auth";
import Image from "next/image";

export default async function AccountPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h2 className="text-xl font-serif text-foreground mb-6 pb-2 border-b border-border">Profile Information</h2>
      
      <div className="bg-white p-6 md:p-8 border border-border flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-24 h-24 relative rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border">
          {user?.image ? (
            <Image src={user.image} alt="Profile" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary-400 font-serif text-3xl">
              {user?.name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-grow space-y-6 w-full text-center md:text-left">
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1 block">Name</label>
            <p className="text-foreground">{user?.name || "Not provided"}</p>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1 block">Email</label>
            <p className="text-foreground">{user?.email}</p>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1 block">Account Type</label>
            <p className="text-foreground">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user?.role === 'ADMIN' ? 'bg-primary-100 text-primary-800' : 'bg-muted text-muted-foreground'
              }`}>
                {user?.role === 'ADMIN' ? 'Administrator' : 'Customer'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
