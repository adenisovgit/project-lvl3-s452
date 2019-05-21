export const feedTemplate = `<div class="card" id="cardTemplate">
<div class="card-header pt-1 pb-1 pl-4 ">
  <div class="row align-items-center">
    <div class="col-6 my-auto" >
      <h5 class="mb-0">
        <button id="rssheadbuttonTemplate" class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTemplate" aria-expanded="true" aria-controls="collapseTemplate">
        </button>
        <span class="badge badge-secondary"></span>
        <span id="spinnerTemplate" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      </h5>
    </div>
    <div class="col-6 my-auto">
      <div id="errorMessageTemplate" class="alert alert-danger my-auto d-none" role="alert"></div>
    </div>
  </div>
</div>
<div id="collapseTemplate" class="collapse pt-0 pb-3 pl-5 show" aria-labelledby="headingTemplate" data-parent="#feedsAccordion">
  <div class="card-body pt-0 pl-0" id="cardbodyTemplate">
  </div>
</div>
</div>`;

export const articleTemplate = `<div class="row">
<div class="col-8 my-auto" >
  <a target="_blank" title="articleLink" href="articleLink">articleTitle</a>        
</div>
<div class="col-2 my-auto" >
  articlePubDate       
</div>
<div class="col-2">
  <!-- Button trigger modal -->
  <button type="button" class="btn btn-outline-secondary" data-toggle="modal" data-target="#articleModal">Description</button>
  <!-- Modal -->
  <div class="modal fade" id="articleModal" tabindex="-1" role="dialog" aria-labelledby="articleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="articleModalLabel">articleTitle</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          articleDescription_14052030
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</div>
</div>`;
