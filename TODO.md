# Vercel Deployment Plan - TODO List

## Phase 1: Backend Conversion to Vercel API Routes ✅ COMPLETED

- [x] 1.1 Create `api/auth/register.ts` - User registration endpoint
- [x] 1.2 Create `api/auth/login.ts` - User login endpoint
- [x] 1.3 Create `api/auth/verify-email.ts` - Email verification endpoint (simplified)
- [x] 1.4 Create `api/documents/upload.ts` - PDF upload with Vercel Blob
- [x] 1.5 Create `api/documents/list.ts` - List user documents
- [x] 1.6 Create `api/documents/delete.ts` - Delete document
- [x] 1.7 Create `api/documents/get.ts` - Get document details
- [ ] 1.8 Create `api/documents/download.ts` - Download signed PDF (pending - requires pdf-lib integration)
- [x] 1.9 Create `api/signatures/create.ts` - Create signature
- [x] 1.10 Create `api/signatures/list.ts` - List user signatures
- [x] 1.11 Create `api/signatures/apply.ts` - Apply signature to document
- [x] 1.12 Create `api/health.ts` - Health check endpoint

## Phase 2: Database Configuration

- [ ] 2.1 Update `server/db.ts` to use Vercel Postgres (HTTP mode)
- [x] 2.2 `shared/schema.ts` is already compatible

## Phase 3: Frontend Updates ✅ COMPLETED

- [x] 3.1 Update `client/src/lib/api.ts` for relative URLs
- [x] 3.2 Update `vite.config.ts` for Vercel

## Phase 4: Vercel Configuration ✅ COMPLETED

- [x] 4.1 Create `vercel.json` configuration
- [x] 4.2 Create `api/_utils.ts` - Shared utilities for API routes
- [x] 4.3 Create `.env.example` with Vercel environment variables
- [x] 4.4 Create `api/tsconfig.json` for API routes TypeScript
- [x] 4.5 Create `VERCEL_DEPLOYMENT.md` - Deployment guide

## Phase 5: File Storage

- [ ] 5.1 Set up Vercel Blob for PDF storage (do in Vercel Dashboard)
- [ ] 5.2 Update upload endpoint to use Vercel Blob (needs `@vercel/blob` package)

## Phase 6: Testing & Deployment

- [ ] 6.1 Install Vercel CLI and test locally: `npm i -g vercel && vercel dev`
- [ ] 6.2 Push to GitHub
- [ ] 6.3 Connect to Vercel and deploy
- [ ] 6.4 Set environment variables in Vercel (DATABASE_URL, BLOB_READ_WRITE_TOKEN)
- [ ] 6.5 Verify all endpoints work

---

## 📁 Files Created/Modified

### New Files
| File | Purpose |
|------|---------|
| `api/_utils.ts` | Shared DB and response utilities |
| `api/auth/register.ts` | User registration API |
| `api/auth/login.ts` | User login API |
| `api/signatures/create.ts` | Create signature API |
| `api/signatures/list.ts` | List signatures API |
| `api/signatures/apply.ts` | Apply signature API |
| `api/documents/upload.ts` | Upload PDF API |
| `api/documents/list.ts` | List documents API |
| `api/documents/delete.ts` | Delete document API |
| `api/documents/get.ts` | Get document API |
| `api/health.ts` | Health check API |
| `api/tsconfig.json` | TypeScript config for API |
| `vercel.json` | Vercel deployment config |
| `.env.example` | Environment variables template |
| `VERCEL_DEPLOYMENT.md` | Deployment guide |

### Modified Files
| File | Change |
|------|--------|
| `client/src/lib/api.ts` | Use relative URLs for Vercel |
| `vite.config.ts` | Support Vercel deployment |
| `TODO.md` | Updated progress tracking |

