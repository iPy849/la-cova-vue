import analytics from '@/services/firebase/analytics';
import { logEvent } from 'firebase/analytics';

async function sendAnalyticsLog(logName, data) {
  if (data) {
    await logEvent(analytics, logName, data);
  } else {
    await logEvent(analytics, logName);
  }
}

export default {
  sendAnalyticsLog,
};
