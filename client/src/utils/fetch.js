
import Cookies from 'js-cookie';

function getHeaders(isFileUpload = false) {
  const headers = new Headers();
  const token = Cookies.get('access_token');

  if (isFileUpload) {
    headers.append('Content-Type', 'multipart/form-data');
  } else {
    headers.append("Content-Type", "application/json");
  }

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export async function get(url) {
  return await fetch(url, {
    method: "GET", 
    headers: getHeaders(),
  });
}

export async function post(url, data, hasFile = false) {
  return await fetch(url, {
    method: "POST",
    headers: getHeaders(hasFile),
    body: JSON.stringify(data),
  });
}
export async function postForm(url, formData, hasFile = false) {
  console.log(formData);
  return await fetch(url, {
    method: "POST",
    headers: getHeaders(hasFile),
    body: formData,
  });
}

export async function put(url, data) {
  return await fetch(url, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
}

export async function patch(url, data) {
  return await fetch(url, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
}

export async function del(url) {
  return await fetch(url, {
    method: "DELETE",
    headers: getHeaders(),
  });
}