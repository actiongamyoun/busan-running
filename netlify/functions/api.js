// netlify/functions/api.js  ─  Supabase 완전 연동판
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'Content-Type': 'application/json'
};

async function sb(path, method = 'GET', body = null, extra = {}) {
  const h = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...extra
  };
  if (method === 'POST' || method === 'PATCH') h['Prefer'] = 'return=representation';
  const opts = { method, headers: h };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, opts);
  const text = await r.text();
  try { return JSON.parse(text); } catch { return text; }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  let params;
  try { params = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }
  const { action, ...p } = params;

  try {
    let data;
    switch (action) {

      // ── 프로필 ──────────────────────────────────────────────────────
      case 'checkNickname': {
        // 닉네임 중복 확인
        const rows = await sb(`profiles?nickname=eq.${encodeURIComponent(p.nickname)}&select=id`);
        data = { exists: Array.isArray(rows) && rows.length > 0 };
        break;
      }
      case 'createProfile': {
        // 중복 확인 후 생성
        const existing = await sb(`profiles?nickname=eq.${encodeURIComponent(p.nickname)}&select=id,nickname`);
        if (Array.isArray(existing) && existing.length > 0) {
          data = { error: 'duplicate', profile: existing[0] };
        } else {
          const created = await sb('profiles', 'POST', { nickname: p.nickname, lang: p.lang || 'ko' });
          data = { profile: Array.isArray(created) ? created[0] : created };
        }
        break;
      }
      case 'getProfile': {
        const rows = await sb(`profiles?nickname=eq.${encodeURIComponent(p.nickname)}&select=*`);
        data = Array.isArray(rows) ? rows[0] || null : null;
        break;
      }

      // ── 코스 ────────────────────────────────────────────────────────
      case 'getCourses':
        data = await sb('courses?select=*&order=id');
        break;

      // ── 좋아요 (공식 코스) ───────────────────────────────────────────
      case 'getLikes':
        data = await sb('likes?select=course_id,user_id');
        break;
      case 'toggleLike': {
        const ex = await sb(`likes?course_id=eq.${p.course_id}&user_id=eq.${p.user_id}&select=id`);
        if (Array.isArray(ex) && ex.length > 0) {
          await sb(`likes?id=eq.${ex[0].id}`, 'DELETE');
          data = { action: 'removed' };
        } else {
          data = await sb('likes', 'POST', { course_id: p.course_id, user_id: p.user_id });
          data = { action: 'added' };
        }
        break;
      }

      // ── 별점 ────────────────────────────────────────────────────────
      case 'getRatings':
        data = await sb('ratings?select=course_id,user_id,score');
        break;
      case 'upsertRating': {
        const ex = await sb(`ratings?course_id=eq.${p.course_id}&user_id=eq.${p.user_id}&select=id`);
        if (Array.isArray(ex) && ex.length > 0) {
          await sb(`ratings?id=eq.${ex[0].id}`, 'PATCH', { score: p.score });
          data = { updated: true };
        } else {
          data = await sb('ratings', 'POST', { course_id: p.course_id, user_id: p.user_id, score: p.score });
        }
        break;
      }

      // ── 댓글 (공식 코스) ─────────────────────────────────────────────
      case 'getComments':
        data = await sb('comments?select=*&order=created_at.desc');
        break;
      case 'addComment':
        data = await sb('comments', 'POST', { course_id: p.course_id, user_id: p.user_id, nickname: p.nickname, body: p.body });
        break;

      // ── 추천 코스 ────────────────────────────────────────────────────
      case 'getRecCourses':
        data = await sb('rec_courses?select=*&order=created_at.desc');
        break;
      case 'createRecCourse':
        data = await sb('rec_courses', 'POST', {
          id: p.id, name: p.name, description: p.description,
          area: p.area, distance: p.distance, difficulty: p.difficulty,
          elevation: p.elevation || 0, surface: p.surface || '',
          tags: p.tags || [], no_signal: p.no_signal || false,
          emoji: p.emoji || '📍', color: p.color || '#059669',
          lat: p.lat, lng: p.lng, route_coords: p.route_coords || [],
          author_id: p.author_id, author_nickname: p.author_nickname
        });
        break;

      // ── 추천 코스 좋아요 ─────────────────────────────────────────────
      case 'getRecLikes':
        data = await sb('rec_likes?select=rec_course_id,user_id');
        break;
      case 'toggleRecLike': {
        const ex = await sb(`rec_likes?rec_course_id=eq.${p.rec_course_id}&user_id=eq.${p.user_id}&select=id`);
        if (Array.isArray(ex) && ex.length > 0) {
          await sb(`rec_likes?id=eq.${ex[0].id}`, 'DELETE');
          data = { action: 'removed' };
        } else {
          await sb('rec_likes', 'POST', { rec_course_id: p.rec_course_id, user_id: p.user_id });
          data = { action: 'added' };
        }
        break;
      }

      // ── 추천 코스 댓글 ────────────────────────────────────────────────
      case 'getRecComments':
        data = await sb('rec_comments?select=*&order=created_at.desc');
        break;
      case 'addRecComment':
        data = await sb('rec_comments', 'POST', { rec_course_id: p.rec_course_id, user_id: p.user_id, nickname: p.nickname, body: p.body });
        break;

      // ── 같이 달려요 ──────────────────────────────────────────────────
      case 'getGroupRuns':
        data = await sb('group_runs?select=*,group_run_members(*)&status=eq.open&order=run_date');
        break;
      case 'createGroupRun':
        data = await sb('group_runs', 'POST', {
          course_id: p.course_id, host_id: p.host_id, host_nickname: p.host_nickname,
          title_ko: p.title, description_ko: p.description,
          run_date: p.run_date, max_members: p.max_members || 10,
          pace: p.pace, status: 'open'
        });
        break;
      case 'joinGroupRun':
        data = await sb('group_run_members', 'POST', { group_run_id: p.group_run_id, user_id: p.user_id, nickname: p.nickname });
        break;
      case 'leaveGroupRun':
        await sb(`group_run_members?group_run_id=eq.${p.group_run_id}&user_id=eq.${p.user_id}`, 'DELETE');
        data = { left: true };
        break;

      // ── GPS 러닝 기록 ─────────────────────────────────────────────────
      case 'saveRunRecord':
        data = await sb('run_records', 'POST', { user_id: p.user_id, course_id: p.course_id || null, distance: p.distance, duration: p.duration, avg_pace: p.avg_pace, route: p.route || [] });
        break;
      case 'getMyRecords':
        data = await sb(`run_records?user_id=eq.${p.user_id}&select=*&order=created_at.desc&limit=20`);
        break;

      default:
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action' }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
