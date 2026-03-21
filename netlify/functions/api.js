const SB_URL=process.env.SUPABASE_URL;
const SB_KEY=process.env.SUPABASE_SERVICE_KEY;
const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'GET,POST,DELETE,PATCH,OPTIONS','Content-Type':'application/json'};

async function sb(path,method='GET',body=null){
  const o={method,headers:{'apikey':SB_KEY,'Authorization':`Bearer ${SB_KEY}`,'Content-Type':'application/json'}};
  if(method==='POST')o.headers['Prefer']='return=representation';
  if(body)o.body=JSON.stringify(body);
  const r=await fetch(`${SB_URL}/rest/v1/${path}`,o);
  if(method==='DELETE')return{ok:true};
  return r.json();
}
async function sbPatch(path,body){
  await fetch(`${SB_URL}/rest/v1/${path}`,{method:'PATCH',headers:{'apikey':SB_KEY,'Authorization':`Bearer ${SB_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  return{ok:true};
}

exports.handler=async(ev)=>{
  if(ev.httpMethod==='OPTIONS')return{statusCode:200,headers:H,body:''};
  let p;try{p=JSON.parse(ev.body||'{}')}catch{return{statusCode:400,headers:H,body:'{"error":"bad json"}'}}
  const{action,...pr}=p;
  try{let d;switch(action){

  // 프로필
  case'createProfile':d=await sb('profiles','POST',{nickname:pr.nickname,lang:pr.lang||'ko'});break;
  case'getProfile':d=await sb(`profiles?nickname=eq.${encodeURIComponent(pr.nickname)}&select=*`);break;
  case'getAllProfiles':d=await sb('profiles?select=id,nickname');break;
  case'getAllProfiles':d=await sb('profiles?select=id,nickname');break;

  // 코스
  case'getCourses':d=await sb('courses?select=*&order=id');break;

  // 좋아요
  case'getLikes':d=await sb('likes?select=course_id,user_id');break;
  case'toggleLike':{
    const ex=await sb(`likes?course_id=eq.${pr.course_id}&user_id=eq.${pr.user_id}&select=id`);
    if(ex.length>0){await sb(`likes?id=eq.${ex[0].id}`,'DELETE');d={action:'removed'}}
    else d=await sb('likes','POST',{course_id:pr.course_id,user_id:pr.user_id});
  }break;

  // 별점
  case'getRatings':d=await sb('ratings?select=course_id,user_id,score');break;
  case'upsertRating':{
    const ex=await sb(`ratings?course_id=eq.${pr.course_id}&user_id=eq.${pr.user_id}&select=id`);
    if(ex.length>0){await sbPatch(`ratings?id=eq.${ex[0].id}`,{score:pr.score});d={ok:true}}
    else d=await sb('ratings','POST',{course_id:pr.course_id,user_id:pr.user_id,score:pr.score});
  }break;

  // 댓글
  case'getComments':d=await sb('comments?select=*&order=created_at.desc');break;
  case'addComment':d=await sb('comments','POST',{course_id:pr.course_id,user_id:pr.user_id,nickname:pr.nickname,body:pr.body});break;

  // 추천코스
  case'getRecCourses':d=await sb('rec_courses?select=*&order=created_at.desc');break;
  case'createRecCourse':d=await sb('rec_courses','POST',pr);break;

  // 추천코스 좋아요
  case'getRecLikes':d=await sb('rec_likes?select=rec_course_id,user_id');break;
  case'toggleRecLike':{
    const ex=await sb(`rec_likes?rec_course_id=eq.${pr.rec_course_id}&user_id=eq.${pr.user_id}&select=id`);
    if(ex.length>0){await sb(`rec_likes?id=eq.${ex[0].id}`,'DELETE');d={action:'removed'}}
    else d=await sb('rec_likes','POST',{rec_course_id:pr.rec_course_id,user_id:pr.user_id});
  }break;

  // 추천코스 댓글
  case'getRecComments':d=await sb('rec_comments?select=*&order=created_at.desc');break;
  case'addRecComment':d=await sb('rec_comments','POST',{rec_course_id:pr.rec_course_id,user_id:pr.user_id,nickname:pr.nickname,body:pr.body});break;

  // 같이 달려요
  case'getGroupRuns':d=await sb('group_runs?select=*,group_run_members(*)&order=run_date');break;
  case'createGroupRun':d=await sb('group_runs','POST',pr);break;
  case'joinGroupRun':d=await sb('group_run_members','POST',{group_run_id:pr.group_run_id,user_id:pr.user_id,nickname:pr.nickname});break;
  case'leaveGroupRun':d=await sb(`group_run_members?group_run_id=eq.${pr.group_run_id}&user_id=eq.${pr.user_id}`,'DELETE');break;

  // 러닝 기록
  case'saveRunRecord':d=await sb('run_records','POST',pr);break;
  case'getMyRecords':d=await sb(`run_records?user_id=eq.${pr.user_id}&select=*&order=created_at.desc&limit=20`);break;

  default:return{statusCode:400,headers:H,body:'{"error":"unknown action"}'}}
  return{statusCode:200,headers:H,body:JSON.stringify(d)}}
  catch(e){return{statusCode:500,headers:H,body:JSON.stringify({error:e.message})}}
};
