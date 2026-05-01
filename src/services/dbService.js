import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const TOPICS_COL = "uploaded_topics";

// ── Parse filename like "WINSEM2025-26_VL_ISTS202P_00100_SS_2026-01-07_Syllogisms1_1"
export function parseFilename(filename) {
  const base = filename.replace(/\.pdf$/i, "");
  const parts = base.split("_");

  const semPart = parts[0] || "";
  let semester = "Unknown";
  let year = "Unknown";

  if (semPart.toUpperCase().startsWith("WINSEM")) {
    semester = "Winter Semester";
    year = semPart.substring(6);
  } else if (semPart.toUpperCase().startsWith("FALLSEM")) {
    semester = "Fall Semester";
    year = semPart.substring(7);
  } else if (semPart.toUpperCase().startsWith("SUM")) {
    semester = "Summer Semester";
    year = semPart.substring(3);
  } else {
    const yearMatch = semPart.match(/(\d{4}-\d{2,4})/);
    if (yearMatch) year = yearMatch[1];
  }

  const courseCode = parts.find(p => /^[A-Z]{2,4}\d{3,4}[A-Z]?$/i.test(p)) || "N/A";

  const topicParts = parts.filter(p => {
    if (!p) return false;
    if (/^\d+$/.test(p)) return false;
    if (/^\d{4}-\d{2}-\d{2}$/.test(p)) return false;
    if (p.length <= 2) return false;
    if (/^(VL|ELA|TH|SS|SL|ETH|CH)$/i.test(p)) return false;
    if (p === courseCode) return false;
    if (p === semPart) return false;
    return true;
  });

  let rawTopic = topicParts[topicParts.length - 1] || parts[parts.length - 1] || "Unknown";
  let topicName = rawTopic.replace(/\d+$/, "").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  if (!topicName) topicName = rawTopic;

  return { semester, year, courseCode, topicName, rawFilename: base };
}

export function filenameToId(filename) {
  const base = filename.replace(/\.pdf$/i, "");
  return base.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase().substring(0, 100);
}

export async function checkTopicExists(topicId) {
  if (db?._isDummy) return null;
  const ref = doc(db, TOPICS_COL, topicId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveTopic(topicId, topicData) {
  if (db?._isDummy) throw new Error("Firebase not configured");
  const ref = doc(db, TOPICS_COL, topicId);
  await setDoc(ref, {
    ...topicData,
    uploadedAt: serverTimestamp(),
  });
}

export async function getAllTopics() {
  if (db?._isDummy) return [];
  const q = query(collection(db, TOPICS_COL), orderBy("uploadedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Updated with error callback
export function subscribeToTopics(callback, errorCallback) {
  if (db?._isDummy) {
    if (errorCallback) errorCallback(new Error("Firebase not configured"));
    return () => {};
  }
  const q = query(collection(db, TOPICS_COL), orderBy("uploadedAt", "desc"));
  return onSnapshot(q, snap => {
    const topics = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(topics);
  }, errorCallback);
}

export function subscribeToTopicsByCategory(catId, callback, errorCallback) {
  if (db?._isDummy) return () => {};
  const q = query(
    collection(db, TOPICS_COL),
    where("mainCategory", "==", catId),
    orderBy("uploadedAt", "desc")
  );
  return onSnapshot(q, snap => {
    const topics = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(topics);
  }, errorCallback);
}
