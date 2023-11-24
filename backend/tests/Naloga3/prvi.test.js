import http from 'k6/http';
import { sleep, check } from 'k6';

// export let options = {
//   vus: 1,
//   duration: '20s',
// };
export let options = {
  vus: 10,              
  duration: '5m',        

  thresholds: {        
    "http_req_duration": ["p(95)<800"],       // 95% of response times should be below 800ms
    "http_req_failed": ["rate<0.01"],         // Fail rate should be below 1%
  },
};



const BASE_URL = 'https://diploma-insight.onrender.com';
const userCredentials = {
  email: 'admin@a',
  password: '123',
};
const faculty = {
  name: "Example Faculty",
  university_id: 1
};

export default function () {
  // Login
  let res = http.post(`${BASE_URL}/login`, userCredentials);
  checkResponse(res, 200, 'Login');

  // Logout
  res = http.post(`${BASE_URL}/logout`);
  checkResponse(res, 200, 'Logout');

  // Fetch Study Program by ID
  res = http.post(`${BASE_URL}/studyProgram/studyProgram/2`);
  checkResponse(res, 200, 'Fetch Study Program');

  // Fetch University by ID
  res = http.post(`${BASE_URL}/university/university/2`);
  checkResponse(res, 200, 'Fetch University');

  // Fetch Faculty by ID
  res = http.post(`${BASE_URL}/faculty/faculty/2`);
  checkResponse(res, 200, 'Fetch Faculty');

  // Create a Faculty
  res = http.post(`${BASE_URL}/faculty/create`, faculty);
  checkResponse(res, 200, 'Create Faculty');

  sleep(1);
}

function checkResponse(res, expectedStatus, actionName) {
  check(res, { [`${actionName} status is ${expectedStatus}`]: (r) => r.status === expectedStatus });
  if (res.status !== expectedStatus) {
    console.error(`Unexpected status code for ${actionName}: ${res.status}. Body: ${res.body}`);
  }
}
