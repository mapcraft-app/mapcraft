exports.itemModal = (ID) => `
<div class="uk-margin">
	<button class="uk-button uk-button-primary" type="button" uk-toggle="target: #form-item-modal-${ID}">
		<span uk-icon="pencil"></span>
		<span lang="Item.EditItem"></span>
	</button>
</div>
<div id="form-item-modal-container-${ID}">
	<div id="form-item-modal-${ID}" class="uk-flex-top uk-modal" container="form-item-modal-container-${ID}" uk-modal="bg-close:false;stack:true;">
		<div class="uk-modal-dialog uk-margin-auto-vertical" uk-overflow-auto>
			<div class="uk-modal-header">
				<h2 class="uk-modal-title" lang="Item.EditItem"></h2>
			</div>
			<div class="uk-modal-body">
				<button class="uk-modal-close-default" type="button" uk-close></button>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-item-modal-item" lang="Item.Item"></label>
					<div id="form-item-modal-item"></div>
				</div>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-item-modal-nbt" lang="Item.NBT"></label>
					<div class="uk-form-controls">
						<input class="uk-input" id="form-item-modal-nbt" type="text">
					</div>
				</div>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-item-modal-data" lang="Item.Data"></label>
					<div class="uk-form-controls">
						<input class="uk-input" id="form-item-modal-data" type="number" min="0">
					</div>
				</div>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-item-modal-tag" lang="Item.Tag"></label>
					<div class="uk-form-controls">
						<input class="uk-input" id="form-item-modal-tag" type="text">
					</div>
				</div>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-item-modal-count" lang="Item.Count"></label>
					<div class="form-padding-left uk-grid uk-grid-small" id="form-item-modal-count">
						<div class="uk-width-1-2">
							<label class="uk-form-label" for="form-item-modal-count-min" lang="Item.Minimum"></label>
							<input class="uk-input" id="form-item-modal-count-min" type="number" min="0">
						</div>
						<div class="uk-width-1-2">
							<label class="uk-form-label" for="form-item-modal-count-max" lang="Item.Maximum"></label>
							<input class="uk-input" id="form-item-modal-count-max" type="number" min="0">
						</div>
					</div>
				</div>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-item-modal-durability" lang="Item.Durability"></label>
					<div class="form-padding-left uk-grid uk-grid-small" id="form-item-modal-durability">
						<div class="uk-width-1-2">
							<label class="uk-form-label" for="form-item-modal-durability-min" lang="Item.Minimum"></label>
							<input class="uk-input" id="form-item-modal-durability-min" type="number" min="0">
						</div>
						<div class="uk-width-1-2">
							<label class="uk-form-label" for="form-item-modal-durability-max" lang="Item.Maximum"></label>
							<input class="uk-input" id="form-item-modal-durability-max" type="number" min="0">
						</div>
					</div>
				</div>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-item-modal-potion" lang="Item.Potion"></label>
					<div id="form-item-modal-potion"></div>
				</div>
			</div>
		</div>
	</div>
</div>
`;
