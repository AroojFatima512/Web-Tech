// Configuration
const API_BASE = 'https://jsonplaceholder.typicode.com';
const POSTS_ENDPOINT = API_BASE + '/posts';

let editingId = null; // null => create mode; otherwise edit mode
let deleteCandidateId = null;
let confirmModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));

$(function(){
  // Initialize
  loadPosts();

  // Form submit (Create or Update)
  $('#postForm').on('submit', function(e){
    e.preventDefault();
    // simple bootstrap validation
    if (!this.checkValidity()) { $(this).addClass('was-validated'); return; }
    const title = $('#postTitle').val().trim();
    const body = $('#postBody').val().trim();

    if (editingId) {
      updatePost(editingId, { title, body });
    } else {
      createPost({ title, body, userId: 1 });
    }
  });

  // Cancel edit
  $('#cancelEditBtn').click(function(){ resetForm(); });

  // Refresh
  $('#refreshBtn').click(function(){ loadPosts(); });

  // Confirm delete
  $('#confirmDeleteBtn').click(function(){
    if (deleteCandidateId) {
      deletePost(deleteCandidateId);
      confirmModal.hide();
    }
  });
});

function setLoading(isLoading) {
  $('#loadingArea').toggleClass('d-none', !isLoading);
  $('#tableArea').toggleClass('d-none', isLoading);
}

function showToast(message, isError=false) {
  const id = 'toast' + Date.now();
  const toastHtml = `
    <div id="${id}" class="toast align-items-center text-bg-${isError? 'danger' : 'success'} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">${escapeHtml(message)}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>`;
  const $el = $(toastHtml);
  $('#toasts').append($el);
  const bsToast = new bootstrap.Toast(document.getElementById(id), { delay: 4000 });
  bsToast.show();
}

function escapeHtml(unsafe) {
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function loadPosts() {
  setLoading(true);
  $('#postsTbody').empty();
  $('#statusArea').html('');

  // limit to 10 posts to keep UI light
  $.ajax({
    url: POSTS_ENDPOINT + '?_limit=10',
    method: 'GET',
    success(data){
      renderPosts(data);
      setLoading(false);
    },
    error(xhr){
      setLoading(false);
      $('#statusArea').html('<div class="alert alert-danger">Failed to load posts.</div>');
      showToast('Failed to load posts from API.', true);
    }
  });
}

function renderPosts(posts) {
  const $tbody = $('#postsTbody');
  $tbody.empty();
  posts.forEach(post => {
    const row = buildRow(post);
    $tbody.append(row);
  });
  $('#tableArea').removeClass('d-none');
}

function buildRow(post) {
  const truncatedBody = post.body && post.body.length > 120 ? post.body.slice(0,120)+'...' : (post.body||'');
  const $tr = $(
    `<tr data-id="${post.id}">
      <td>${post.id}</td>
      <td class="title-col">${escapeHtml(post.title || '')}</td>
      <td class="body-col">${escapeHtml(truncatedBody)}</td>
      <td>
        <div class="btn-group" role="group">
          <button class="btn btn-sm btn-outline-primary editBtn">Edit</button>
          <button class="btn btn-sm btn-outline-danger deleteBtn">Delete</button>
        </div>
      </td>
    </tr>`
  );

  $tr.find('.editBtn').click(function(){ startEdit(post); });
  $tr.find('.deleteBtn').click(function(){
    deleteCandidateId = post.id;
    confirmModal.show();
  });

  return $tr;
}

function startEdit(post) {
  editingId = post.id;
  $('#formTitle').text('Edit Post #' + post.id);
  $('#postTitle').val(post.title);
  $('#postBody').val(post.body);
  $('#saveBtn').text('Update');
  $('#cancelEditBtn').removeClass('d-none');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  editingId = null;
  deleteCandidateId = null;
  $('#postForm')[0].reset();
  $('#postForm').removeClass('was-validated');
  $('#formTitle').text('Create Post');
  $('#saveBtn').text('Save');
  $('#cancelEditBtn').addClass('d-none');
}

function createPost(payload) {
  toggleFormDisabled(true);
  $.ajax({
    url: POSTS_ENDPOINT,
    method: 'POST',
    data: JSON.stringify(payload),
    contentType: 'application/json; charset=UTF-8',
    success(data){
      // JSONPlaceholder returns created object with an id
      // Append to top of list
      const row = buildRow(data);
      $('#postsTbody').prepend(row);
      showToast('Post created (note: JSONPlaceholder does not persist permanently).');
      resetForm();
      toggleFormDisabled(false);
    },
    error(){
      showToast('Failed to create post.', true);
      toggleFormDisabled(false);
    }
  });
}

function updatePost(id, payload) {
  toggleFormDisabled(true);
  $.ajax({
    url: POSTS_ENDPOINT + '/' + id,
    method: 'PUT',
    data: JSON.stringify(payload),
    contentType: 'application/json; charset=UTF-8',
    success(data){
      // Update row in the table
      const $row = $(`#postsTbody tr[data-id='${id}']`);
      if ($row.length) {
        $row.find('.title-col').text(data.title || '');
        const newBody = data.body && data.body.length > 120 ? data.body.slice(0,120)+'...' : data.body;
        $row.find('.body-col').text(newBody || '');
      }
      showToast('Post updated (JSONPlaceholder simulates update).');
      resetForm();
      toggleFormDisabled(false);
    },
    error(){
      showToast('Failed to update post.', true);
      toggleFormDisabled(false);
    }
  });
}

function deletePost(id) {
  // disable confirm button while performing
  $('#confirmDeleteBtn').prop('disabled', true).text('Deleting...');
  $.ajax({
    url: POSTS_ENDPOINT + '/' + id,
    method: 'DELETE',
    success(){
      $(`#postsTbody tr[data-id='${id}']`).remove();
      showToast('Post deleted (JSONPlaceholder simulates delete).');
      $('#confirmDeleteBtn').prop('disabled', false).text('Delete');
    },
    error(){
      showToast('Failed to delete post.', true);
      $('#confirmDeleteBtn').prop('disabled', false).text('Delete');
    }
  });
}

function toggleFormDisabled(disabled) {
  $('#saveBtn').prop('disabled', disabled);
  $('#cancelEditBtn').prop('disabled', disabled);
  $('#postTitle').prop('disabled', disabled);
  $('#postBody').prop('disabled', disabled);
}