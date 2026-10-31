import type { Metadata } from "next";
import { connection } from "next/server";
import { Button } from "@/components/ui/Button";
import { getAdminEnquiries, getAssigneeOptions } from "@/lib/dal/enquiries";
import { EnquiriesManager } from "@/components/admin/enquiries/EnquiriesManager";

export const metadata: Metadata = {
  title: "Enquiries & Membership Applications | NASI India Admin",
};

export default async function AdminEnquiriesPage() {
  await connection();

  const [{ contacts, memberships }, assignees] = await Promise.all([
    getAdminEnquiries({ type: "ALL", status: "ALL" }),
    getAssigneeOptions(),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-300">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
            Inbox Communications
          </span>
          <h1 className="text-2xl font-serif font-bold text-forest-950">
            Enquiries &amp; Membership Applications
          </h1>
          <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
            Manage contact enquiries, prospective member applications, assignments, and follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button href="/contact" variant="outline" size="sm" isExternal>
            Public Contact Form
          </Button>
          <Button href="/join" variant="outline" size="sm" isExternal>
            Public Membership Form
          </Button>
        </div>
      </div>

      {/* Interactive Enquiries Management Console */}
      <EnquiriesManager
        initialContacts={contacts}
        initialMemberships={memberships}
        assignees={assignees}
      />
    </div>
  );
}
