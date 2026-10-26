/**
 * Social Authentication Helper Service.
 * Loads Google Identity Services (GIS) and Facebook SDK dynamically without requiring extra npm packages.
 */

declare global {
  interface Window {
    google?: any;
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

/**
 * Load a script dynamically if not already present.
 */
function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.body.appendChild(script);
  });
}

/**
 * Trigger Google Login using Google Identity Services (GIS).
 * Returns access_token string.
 */
export async function triggerGoogleLogin(clientId: string): Promise<string> {
  if (!clientId) {
    throw new Error("Chưa cấu hình VITE_GOOGLE_CLIENT_ID.");
  }

  await loadScript(
    "https://accounts.google.com/gsi/client",
    "google-gsi-script",
  );

  if (!window.google?.accounts?.oauth2) {
    throw new Error("Không thể tải Google Identity Services SDK.");
  }

  return new Promise((resolve, reject) => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "email profile openid",
        callback: (response: any) => {
          if (response.error) {
            reject(new Error(response.error_description || response.error));
            return;
          }
          if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error("Không nhận được access_token từ Google."));
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: "select_account" });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Trigger Facebook Login using Facebook JS SDK.
 * Returns accessToken string.
 */
export async function triggerFacebookLogin(appId: string): Promise<string> {
  if (!appId || appId.includes("your-facebook-app-id")) {
    throw new Error(
      "Chưa cấu hình VITE_FACEBOOK_APP_ID. Vui lòng cấu hình VITE_FACEBOOK_APP_ID trong file .env",
    );
  }

  await loadScript(
    "https://connect.facebook.net/vi_VN/sdk.js",
    "facebook-jssdk",
  );

  if (!window.FB) {
    throw new Error("Không thể tải Facebook SDK.");
  }

  window.FB.init({
    appId: appId,
    cookie: true,
    xfbml: true,
    version: "v19.0",
  });

  return new Promise((resolve, reject) => {
    window.FB.login(
      (response: any) => {
        if (response.authResponse?.accessToken) {
          resolve(response.authResponse.accessToken);
        } else {
          reject(new Error("Đăng nhập Facebook bị hủy hoặc không thành công."));
        }
      },
      { scope: "public_profile,email" },
    );
  });
}
