import { Haptics, NotificationType } from '@capacitor/haptics';

// 네이티브 햅틱 피드백 (Capacitor)
// 웹 브라우저처럼 햅틱이 없는 환경에서는 조용히 무시된다.

function notify(type: NotificationType): void {
  // fire-and-forget — 햅틱이 없는 환경에서는 rejected promise로 조용히 무시됨
  Haptics.notification({ type }).catch(() => {});
}

export function hapticCorrect(): void {
  notify(NotificationType.Success);
}

export function hapticWrong(): void {
  notify(NotificationType.Error);
}
