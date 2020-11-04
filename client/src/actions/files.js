import axios from "axios";

const BaseURl = "https://freechargedemo.herokuapp.com/api";

export function getAllFiles() {
  return axios.get(`${BaseURl}/file`).then((response) => response.data);
}

export function uploadFile(file_type) {
  const data = new FormData();
  data.append("file", document.getElementById("file").files[0]);
  return axios
    .post(`${BaseURl}/file`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("TOKEN")}`,
      },
    })
    .then(function (res) {
      return res.data;
    });
}

export function register(data) {
  return axios
    .post(`${BaseURl}/user/register`, data)
    .then((res) => localStorage.setItem("TOKEN", res.data.token));
}

export function login(data) {
  return axios
    .post(`${BaseURl}/user/signin`, data)
    .then((res) => localStorage.setItem("TOKEN", res.data.token));
}

export function deleteFile(id) {
  return axios.delete(`${BaseURl}/file/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("TOKEN")}`,
    },
  });
}
