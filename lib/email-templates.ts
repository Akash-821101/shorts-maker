/**
 * Shared Email Templates
 */

export function getVideoReadyEmailTemplate(params: {
  seriesName: string
  thumbnailUrl: string
  videoUrl: string
  downloadUrl: string
}) {
  const { seriesName, thumbnailUrl, videoUrl, downloadUrl } = params

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Video is Ready!</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f4f4f7;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .header {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          padding: 30px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }
        .content {
          padding: 30px;
        }
        .video-card {
          background: #f9fafb;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin-bottom: 25px;
        }
        .thumbnail {
          width: 100%;
          max-width: 480px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin-bottom: 15px;
        }
        .series-name {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 5px;
        }
        .footer {
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
        }
        .button-group {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 12px;
        }
        .btn {
          display: inline-block;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .btn-primary {
          background-color: #6366f1;
          color: #ffffff !important;
        }
        .btn-secondary {
          background-color: #ffffff;
          border: 1px solid #d1d5db;
          color: #374151 !important;
        }
        .btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Video is Ready! 🎬</h1>
        </div>
        <div class="content">
          <p>Hi there,</p>
          <p>Great news! Your video for <strong>${seriesName}</strong> has been generated and is ready for you to use.</p>
          
          <div class="video-card">
            <img src="${thumbnailUrl}" alt="Video Thumbnail" class="thumbnail" />
            <div class="series-name">${seriesName}</div>
            
            <div class="button-group">
              <a href="${videoUrl}" class="btn btn-primary" target="_blank">View Video</a>
              <a href="${downloadUrl}" class="btn btn-secondary" download target="_blank">Download</a>
            </div>
          </div>
          
          <p>You can also find all your generated videos in your dashboard.</p>
        </div>
        <div class="footer">
          <p>Sent with ❤️ from Shorts Maker</p>
        </div>
      </div>
    </body>
    </html>
  `
}
