# NASI India — Operational Troubleshooting Guide

This guide provides diagnostic procedures and resolutions for common issues encountered in development and production environments.

---

## 1. Authentication & Administrative Credential Issues

### Issue: "Forbidden" (403) or Session Lockout
- **Cause**: Session cookie expired, HMAC signature invalid, or user role lacks permission for the requested administrative route.
- **Resolution**:
  1. Clear browser cookies for `nasi_admin_session`.
  2. Verify that `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` or `SESSION_SECRET` in `.env` has not been changed without re-signing.
  3. Ensure the authenticated user has `SUPER_ADMIN` role for `/admin/users` and `/admin/settings`.

### Issue: Lost Super Administrator Password
- **Resolution**: Re-run the offline provisioning script to reset or create an administrator:
  ```bash
  npm run admin:provision
  ```

---

## 2. Database Connection Issues

### Issue: `Can't reach database server at localhost:5432`
- **Cause**: PostgreSQL service is down or credentials in `DATABASE_URL` are incorrect.
- **Resolution**:
  1. Check PostgreSQL service status:
     ```bash
     sudo systemctl status postgresql
     ```
  2. Verify connection using standard `psql`:
     ```bash
     psql "postgresql://user:password@localhost:5432/nasi_india"
     ```
  3. Ensure `DATABASE_URL` in `.env` matches the active database credentials.

### Issue: Prisma Client Schema Out of Sync
- **Cause**: Database was migrated but `@prisma/client` was not regenerated.
- **Resolution**:
  ```bash
  npx prisma generate
  ```

---

## 3. Email Notification Failures

### Issue: Enquiries saved but notifications not received
- **Cause**: SMTP credentials are missing, or SMTP provider rejected transmission.
- **Design Behavior**: The application records `emailDelivered: false` and the exact error in the database. Successful email delivery is **never falsely reported**.
- **Resolution**:
  1. Inspect the admin enquiry details in `/admin/enquiries` to see the `emailError` message.
  2. Verify that `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASSWORD` (or `RESEND_API_KEY`) are set in `.env.local` or environment variables.
  3. Test external connectivity to port 587:
     ```bash
     nc -zv smtp.sendgrid.net 587
     ```

---

## 4. File Upload Verification Errors

### Issue: Upload rejected with "Invalid file content"
- **Cause**: The upload service verifies binary magic bytes (`storage.ts`). Renaming an executable (`.exe`) to `.pdf` or spoofing the MIME type triggers an immediate security rejection.
- **Resolution**:
  Ensure the uploaded file is a genuine, uncorrupted PDF (`%PDF` binary header) or JPEG/PNG/WebP image.

---

## 5. Next.js 16 Dynamic & Prerender Errors

### Issue: `Next.js encountered the unstable value new Date() while prerendering`
- **Cause**: Next.js 16 Partial Prerendering (PPR) detects `new Date()` called during static build steps without a fixed build threshold.
- **Resolution**:
  Use `process.env.NEXT_PHASE === "phase-production-build"` with a stable build timestamp in DAL query thresholds, or add `await connection()` in request-time Dynamic Server Components.

