# API Setup Guide

## Cấu hình biến môi trường

Tạo file `.env` trong thư mục gốc với nội dung:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8888

# Development credentials (only used when not in Telegram WebApp)
VITE_DEV_ADMIN_ID=5168993511
VITE_DEV_SECRET=123456
```

## Cấu trúc API

### Accounts API
- **GET** `/api/accounts` - Lấy danh sách tài khoản
- **DELETE** `/api/accounts/{id}` - Xóa tài khoản

### Upload API
- **POST** `/api/upload/txt` - Upload file txt
- **POST** `/api/upload/xml` - Upload file xml

### API Config API
- **GET** `/api/api-configs` - Lấy danh sách cấu hình API
- **POST** `/api/api-configs` - Tạo cấu hình mới
- **PUT** `/api/api-configs/{id}` - Cập nhật cấu hình
- **DELETE** `/api/api-configs/{id}` - Xóa cấu hình

### Purchase API
- **POST** `/api/purchase` - Test purchase với API config

### Auto API
- **GET** `/api/auto` - Lấy danh sách Auto jobs
- **POST** `/api/auto/start` - Tạo Auto job mới
- **DELETE** `/api/auto/{jobId}` - Dừng Auto job

### Smart Auto API
- **GET** `/api/products/{configId}` - Lấy sản phẩm và categories cho API config
- **POST** `/api/auto-run` - Chạy Smart Auto một lần
- **POST** `/api/smart-auto/start` - Lên lịch Smart Auto
- **DELETE** `/api/smart-auto/{jobId}` - Dừng Smart Auto job
- **GET** `/api/auto` - Lấy danh sách jobs (bao gồm Smart Auto jobs)

### Response Format

#### Accounts
```json
{
  "data": [
    {
      "id": 1,
      "info": "Account information",
      "status": "active"
    }
  ]
}
```

#### Upload
```json
{
  "message": "Upload thành công",
  "import_result": {
    "success_count": 10,
    "failed_count": 2
  }
}
```

#### API Config
```json
{
  "id": 1,
  "name": "Facebook Clone API",
  "version": "version_1",
  "domain": "facebook.com",
  "endpoint": "/api/BResource.php",
  "username": "user123",
  "password": "pass123",
  "product_id": "fb_clone_001",
  "amount": 1000,
  "enabled": true
}
```

#### Purchase Test
```json
{
  "message": "Test purchase thành công",
  "success_count": 1
}
```

#### Auto Start Response
```json
{
  "job_id": "auto_123",
  "message": "Auto job đã được tạo thành công",
  "status": "started"
}
```

#### Jobs Response
```json
{
  "jobs": [
    {
      "id": "auto_123",
      "name": "Facebook Auto Job",
      "next_run": "2024-08-16T10:00:00Z",
      "interval": 300,
      "status": "running"
    }
  ]
}
```

#### Smart Auto Response
```json
{
  "status": "completed",
  "message": "Smart Auto đã hoàn thành!",
  "results": [
    {
      "api_name": "Facebook Clone API",
      "status": "completed",
      "message": "Đã mua thành công 1 sản phẩm"
    }
  ]
}
```

#### Products Response
```json
{
  "products": [
    {
      "id": "123",
      "name": "Facebook Clone Premium",
      "price": 500,
      "amount": 10,
      "category_id": "1",
      "category_name": "Social Media"
    }
  ],
  "categories": [
    {
      "id": "1",
      "name": "Social Media",
      "has_products": true,
      "product_count": 5
    }
  ]
}
```

## Sử dụng trong code

```typescript
import { fetchAccounts, deleteAccount } from '@/services/accountService';
import { uploadTxtFile, uploadXmlFile } from '@/services/uploadService';
import { 
    fetchApiConfigsList, 
    createApiConfig, 
    updateApiConfig, 
    deleteApiConfig, 
    testPurchase 
} from '@/services/apiConfigService';
import {
    fetchProducts,
    refreshJobs,
    startSmartAutoScheduled,
    runSmartAutoOnce,
    stopSmartAutoJob
} from '@/services/smartAutoService';
import {
    startAutoJob,
    stopAutoJob,
    refreshJobs as refreshAutoJobs
} from '@/services/autoService';

// Lấy danh sách accounts
const accounts = await fetchAccounts();

// Xóa account
await deleteAccount(accountId);

// Upload txt file
const formData = new FormData();
formData.append('file', file);
const result = await uploadTxtFile(formData);

// Upload xml file
const xmlResult = await uploadXmlFile(formData);

// API Config operations
const configs = await fetchApiConfigsList();
const newConfig = await createApiConfig(configData);
await updateApiConfig(updatedConfig);
await deleteApiConfig(configId);
const purchaseResult = await testPurchase({ api_config_id: configId, custom_amount: 1 });

// Smart Auto operations
const products = await fetchProducts(configId);
const jobs = await refreshJobs();
const smartAutoResult = await runSmartAutoOnce(config);
const scheduledJob = await startSmartAutoScheduled(config);
await stopSmartAutoJob(jobId);

// Auto operations
const autoJob = await startAutoJob({ api_config_id: configId, product_id: "product_001" });
await stopAutoJob(jobId);
const autoJobs = await refreshAutoJobs();
```

## Headers tự động

Hệ thống sẽ tự động thêm headers phù hợp:
- Trong Telegram WebApp: `x-telegram-init-data`
- Trong development: `x-dev-admin-id` và `x-dev-secret`
