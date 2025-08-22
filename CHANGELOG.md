# Changelog

## [2024-08-15] - Chuyển đổi từ App.js sang Telegram Mini App

### Thêm mới
- **UploadPage**: Trang upload file txt/xml với giao diện Telegram UI
- **AutoPage**: Trang quản lý auto jobs với cấu hình API và quản lý jobs
- **SmartAutoPage**: Trang Smart Auto với logic phức tạp từ App.js, bao gồm:
  - Chọn APIs để chạy
  - Cấu hình scheduler mode
  - Preview sản phẩm
  - Quản lý Smart Auto jobs
  - Hiển thị kết quả
- **RunsPage**: Trang xem lịch sử runs và kết quả

### Cập nhật
- **ManagementPage**: Thêm các link đến các trang mới:
  - Upload Files
  - Auto Jobs  
  - Smart Auto
  - Run History
- **TabBar**: Thêm routes cho các trang mới
- **AccountPage**: Sửa lỗi TypeScript (xóa imports không sử dụng)
- **ApiConfigPage**: Sửa lỗi TypeScript (xóa biến không sử dụng)
- **StatisticsPage**: Sửa lỗi TypeScript (xóa biến không sử dụng)

### Kỹ thuật
- Sử dụng Telegram UI components thay vì Material-UI
- Implement TypeScript interfaces cho tất cả data structures
- Tạo CSS modules cho styling
- Chuẩn bị sẵn TODO comments cho API integration
- Giữ nguyên logic business từ App.js nhưng chuyển sang Telegram UI

### Cấu trúc thư mục
```
src/pages/
├── AccountPage/          # Quản lý tài khoản
├── ApiConfigPage/        # Quản lý cấu hình API
├── AutoPage/            # Quản lý auto jobs
├── ManagementPage/      # Trang chính quản lý
├── RunsPage/            # Lịch sử runs
├── SmartAutoPage/       # Smart Auto - tính năng chính
├── StatisticsPage/      # Thống kê
└── UploadPage/          # Upload files
```

### Lưu ý
- Tất cả API calls đã được comment với TODO để implement sau
- Logic business được giữ nguyên từ App.js
- Giao diện được chuyển đổi sang Telegram UI components
- Build thành công, sẵn sàng để deploy

## [2024-08-15] - Tích hợp API Backend

### Thêm mới
- **API Configuration**: File `src/config/api.ts` để quản lý API calls
- **Account Service**: File `src/services/accountService.ts` để gọi API accounts
- **Environment Variables**: Hỗ trợ biến môi trường cho API configuration
- **Loading & Error States**: Thêm loading và error handling cho AccountPage

### Cập nhật
- **AccountPage**: 
  - Lấy dữ liệu từ backend API thay vì mock data
  - Thêm loading state khi tải dữ liệu
  - Thêm error handling và retry button
  - Xóa account thông qua API
- **API Integration**: Tự động thêm headers cho Telegram WebApp và development mode

### Cấu hình
- Tạo file `.env` với các biến:
  - `VITE_API_BASE_URL=http://localhost:8888`
  - `VITE_DEV_ADMIN_ID=5168993511`
  - `VITE_DEV_SECRET=123456`

### API Endpoints
- `GET /api/accounts` - Lấy danh sách tài khoản
- `DELETE /api/accounts/{id}` - Xóa tài khoản

### Headers tự động
- Telegram WebApp: `x-telegram-init-data`
- Development: `x-dev-admin-id` và `x-dev-secret`

## [2024-08-15] - Tích hợp Auto API

### Thêm mới
- **Auto Service**: File `src/services/autoService.ts` để gọi API Auto
- **Auto Interfaces**: TypeScript interfaces cho Auto operations
- **Job Management**: Quản lý Auto jobs (start, stop, refresh)

### Cập nhật
- **AutoPage**: 
  - Tích hợp với backend API thay vì mock data
  - Lấy danh sách API configs qua `GET /api/api-configs`
  - Tạo Auto job qua `POST /api/auto/start`
  - Dừng Auto job qua `DELETE /api/auto/{jobId}`
  - Refresh jobs qua `GET /api/auto`
  - Loading state và error handling
  - Validation theo version API (V1/V2)

### Logic từ App.js
- **API Config Loading**: Load danh sách API configs đã enabled
- **Version-based Validation**: Version 2 cần Product ID, Version 1 tùy chọn
- **Job Filtering**: Tách biệt Auto jobs và Smart Auto jobs
- **Error Handling**: Xử lý lỗi và hiển thị thông báo
- **Form Reset**: Reset form sau khi tạo job thành công

### API Endpoints
- `GET /api/auto` - Lấy danh sách jobs
- `POST /api/auto/start` - Tạo Auto job mới
- `DELETE /api/auto/{jobId}` - Dừng Auto job

## [2024-08-15] - Tích hợp Smart Auto API

### Thêm mới
- **Smart Auto Service**: File `src/services/smartAutoService.ts` để gọi API Smart Auto
- **Smart Auto Interfaces**: TypeScript interfaces cho tất cả Smart Auto operations
- **Products & Categories API**: Lấy sản phẩm và categories cho từng API config

### Cập nhật
- **SmartAutoPage**: 
  - Tích hợp với backend API thay vì mock data
  - Lấy danh sách API configs qua `GET /api/api-configs`
  - Lấy sản phẩm qua `GET /api/products/{configId}`
  - Chạy Smart Auto một lần qua `POST /api/auto-run`
  - Lên lịch Smart Auto qua `POST /api/smart-auto/start`
  - Dừng Smart Auto job qua `DELETE /api/smart-auto/{jobId}`
  - Refresh jobs qua `GET /api/auto`
  - Loading state và error handling

### API Endpoints
- `GET /api/products/{configId}` - Lấy sản phẩm và categories cho API config
- `POST /api/auto-run` - Chạy Smart Auto một lần
- `POST /api/smart-auto/start` - Lên lịch Smart Auto
- `DELETE /api/smart-auto/{jobId}` - Dừng Smart Auto job
- `GET /api/auto` - Lấy danh sách jobs (bao gồm Smart Auto jobs)

### Features
- **API Selection**: Chọn nhiều APIs để chạy Smart Auto
- **Scheduler Mode**: Chế độ lên lịch tự động với interval configurable
- **One-time Run**: Chạy Smart Auto một lần ngay lập tức
- **Product Preview**: Xem sản phẩm có sẵn cho từng API
- **Job Management**: Quản lý Smart Auto jobs đang chạy
- **Real-time Results**: Hiển thị kết quả Smart Auto
- **Error Handling**: Xử lý lỗi chi tiết từ backend

### Logic từ App.js
- **Filter Logic**: Sử dụng bộ lọc riêng của từng API (giá, categories)
- **Version Support**: Hỗ trợ cả Version 1 và Version 2 APIs
- **Product Loading**: Tự động load sản phẩm cho Version 2 APIs
- **Job Filtering**: Tách biệt Smart Auto jobs và regular jobs
- **Config Validation**: Kiểm tra required fields theo version

### UI Improvements
- **Product Preview**: Hiển thị chi tiết sản phẩm khi click "Xem SP"
- **Summary Stats**: Tổng quan về số lượng sản phẩm và bộ lọc
- **Product List**: Danh sách sản phẩm với thông tin chi tiết
- **Status Badges**: Hiển thị trạng thái sản phẩm (phù hợp, hết hàng, giá không phù hợp, category bị loại trừ)
- **Responsive Design**: Layout tối ưu cho mobile

## [2024-08-15] - Tích hợp API Config API

### Thêm mới
- **API Config Service**: File `src/services/apiConfigService.ts` để gọi API configs
- **API Config Interfaces**: TypeScript interfaces cho tất cả API operations
- **Mobile-friendly UI**: Thay thế Material-UI table bằng Telegram UI List/Section

### Cập nhật
- **ApiConfigPage**: 
  - Tích hợp với backend API thay vì mock data
  - Tạo cấu hình mới qua `POST /api/api-configs`
  - Cập nhật cấu hình qua `PUT /api/api-configs/{id}`
  - Xóa cấu hình qua `DELETE /api/api-configs/{id}`
  - Test purchase qua `POST /api/purchase`
  - Toggle status enabled/disabled
  - Loading state và error handling
  - Modal form thân thiện với mobile

### API Endpoints
- `GET /api/api-configs` - Lấy danh sách cấu hình API
- `POST /api/api-configs` - Tạo cấu hình mới
- `PUT /api/api-configs/{id}` - Cập nhật cấu hình
- `DELETE /api/api-configs/{id}` - Xóa cấu hình
- `POST /api/purchase` - Test purchase

### UI Improvements
- **Mobile-first Design**: Sử dụng Telegram UI components
- **Card-based Layout**: Mỗi config hiển thị trong Section riêng
- **Modal Forms**: Form tạo/sửa trong modal thân thiện mobile
- **Action Buttons**: Các nút thao tác rõ ràng với icons
- **Status Indicators**: Hiển thị trạng thái enabled/disabled
- **Filter Display**: Hiển thị bộ lọc giá và categories

### Features
- **CRUD Operations**: Create, Read, Update, Delete API configs
- **Validation**: Kiểm tra required fields theo version
- **Real-time Updates**: Refresh data sau mỗi operation
- **Error Handling**: Hiển thị lỗi chi tiết từ backend
- **Loading States**: Feedback khi đang xử lý
- **Responsive Design**: Tối ưu cho mobile devices

## [2024-08-15] - Tích hợp Upload API

### Thêm mới
- **Upload Service**: File `src/services/uploadService.ts` để gọi API upload
- **Upload Response Interface**: TypeScript interface cho API response
- **Result Display**: Hiển thị kết quả upload và lỗi

### Cập nhật
- **UploadPage**: 
  - Tích hợp với backend API thay vì mock
  - Upload txt file qua `POST /api/upload/txt`
  - Upload xml file qua `POST /api/upload/xml`
  - Hiển thị kết quả upload với message và import_result
  - Hiển thị lỗi upload với error message
  - Clear file input sau khi upload thành công
  - Loading state khi đang upload

### API Endpoints
- `POST /api/upload/txt` - Upload file txt
- `POST /api/upload/xml` - Upload file xml

### Response Format
```json
{
  "message": "Upload thành công",
  "import_result": { ... }
}
```

### Features
- **File Validation**: Kiểm tra file type (.txt, .xml)
- **Progress Feedback**: Loading state và kết quả
- **Error Handling**: Hiển thị lỗi chi tiết từ backend
- **Success Display**: Hiển thị kết quả import nếu có
