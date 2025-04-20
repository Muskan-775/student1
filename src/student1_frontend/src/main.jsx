import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory } from './attendance.did.js';  // Ye file aapko `dfx generate` se milegi

// Agent aur Actor setup
const agent = new HttpAgent({ host: 'http://localhost:8000' }); // Yaha apne local ICP endpoint ka URL daalein
const attendChain = Actor.createActor(idlFactory, {
  agent,
  canisterId: 'your-canister-id-here',  // Yaha apne canister ka ID daalein
});

// Attendance mark karne ki function
document.getElementById('markAttendanceForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const studentId = document.getElementById('studentId').value;
  const date = document.getElementById('date').value;
  const status = document.getElementById('status').value;

  const result = await attendChain.markAttendance(studentId, date, status);
  alert(result);
});

// Attendance get karne ki function
async function getAttendance() {
  const studentId = document.getElementById('getStudentId').value;
  const date = document.getElementById('getDate').value;

  const result = await attendChain.getAttendance(studentId, date);

  const attendanceResultDiv = document.getElementById('attendanceResult');
  if (result === null) {
    attendanceResultDiv.textContent = 'No attendance record found for this student on this date.';
  } else {
    attendanceResultDiv.textContent = `Status: ${result.status}`;
  }
}

// All records get karne ki function
async function getAllRecords() {
  const result = await attendChain.allRecords();

  const allRecordsDiv = document.getElementById('allRecordsResult');
  if (result.length === 0) {
    allRecordsDiv.textContent = 'No records found.';
  } else {
    allRecordsDiv.innerHTML = result.map(([key, record]) => {
      return `<p>${key}: ${record.status}</p>`;
    }).join('');
  }
}

