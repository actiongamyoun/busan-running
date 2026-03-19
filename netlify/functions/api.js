// netlify/functions/api.js
// Supabase 키를 서버에서만 사용 - 프론트에 노출 안됨
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
  'Content-Type': 'application/json'
};

async function sbFetch(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : undefined
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, opts);
  return r.json();
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  const { action, ...params } = JSON.parse(event.body || '{}');

  try {
    let data;
    switch (action) {
      // 프로필
      case 'createProfile':
        data = await sbFetch('profiles', 'POST', { nickname: params.nickname, lang: params.lang || 'ko' });
        break;
      case 'getProfile':
        data = await sbFetch(`profiles?nickname=eq.${encodeURIComponent(params.nickname)}&select=*`);
        break;

      // 코스
      case 'getCourses':
        data = await sbFetch('courses?select=*&order=id');
        break;

      // 좋아요
      case 'getLikes':
        data = await sbFetch('likes?select=course_id,user_id');
        break;
      case 'toggleLike':
        const existing = await sbFetch(`likes?course_id=eq.${params.course_id}&user_id=eq.${params.user_id}&select=id`);
        if (existing.length > 0) {
          await sbFetch(`likes?id=eq.${existing[0].id}`, 'DELETE');
          data = { action: 'removed' };
        } else {
          data = await sbFetch('likes', 'POST', { course_id: params.course_id, user_id: params.user_id });
        }
        break;

      // 별점
      case 'getRatings':
        data = await sbFetch('ratings?select=course_id,user_id,score');
        break;
      case 'upsertRating':
        const ex = await sbFetch(`ratings?course_id=eq.${params.course_id}&user_id=eq.${params.user_id}&select=id`);
        if (ex.length > 0) {
          await fetch(`${SUPABASE_URL}/rest/v1/ratings?id=eq.${ex[0].id}`, {
            method: 'PATCH',
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: params.score })
          });
          data = { updated: true };
        } else {
          data = await sbFetch('ratings', 'POST', { course_id: params.course_id, user_id: params.user_id, score: params.score });
        }
        break;

      // 댓글
      case 'getComments':
        data = await sbFetch(`comments?select=*&order=created_at.desc`);
        break;
      case 'addComment':
        data = await sbFetch('comments', 'POST', {
          course_id: params.course_id, user_id: params.user_id,
          nickname: params.nickname, body: params.body
        });
        break;

      // 같이 달려요
      case 'getGroupRuns':
        data = await sbFetch(`group_runs?select=*,group_run_members(*)&status=eq.open&order=run_date`);
        break;
      case 'createGroupRun':
        data = await sbFetch('group_runs', 'POST', params);
        break;
      case 'joinGroupRun':
        data = await sbFetch('group_run_members', 'POST', {
          group_run_id: params.group_run_id, user_id: params.user_id, nickname: params.nickname
        });
        break;
      case 'leaveGroupRun':
        await sbFetch(`group_run_members?group_run_id=eq.${params.group_run_id}&user_id=eq.${params.user_id}`, 'DELETE');
        data = { left: true };
        break;

      // 러닝 기록
      case 'saveRunRecord':
        data = await sbFetch('run_records', 'POST', params);
        break;
      case 'getMyRecords':
        data = await sbFetch(`run_records?user_id=eq.${params.user_id}&select=*&order=created_at.desc&limit=20`);
        break;

      default:
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action' }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
