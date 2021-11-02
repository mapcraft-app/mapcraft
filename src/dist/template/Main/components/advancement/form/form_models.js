exports.itemModal = (ID) => `
<div class="uk-margin">
	<button class="uk-button uk-button-primary uk-width-1-1" type="button" uk-toggle="target: #form-item-modal-${ID}">
		<span uk-icon="pencil"></span>
		<span lang="Edit.Criteria.Item.EditItem"></span>
	</button>
</div>
<div id="form-item-modal-container-${ID}">
	<div id="form-item-modal-${ID}" class="uk-flex-top uk-modal" container="form-item-modal-container-${ID}" uk-modal="bg-close:true;stack:true;">
		<div class="uk-modal-dialog uk-margin-auto-vertical" uk-overflow-auto>
			<div class="uk-modal-header">
				<h2 class="uk-modal-title" lang="Edit.Criteria.Item.EditItem"></h2>
			</div>
			<div class="uk-modal-body">
				<button class="uk-modal-close-default" type="button" uk-close></button>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-item-modal-item" lang="Edit.Criteria.Item.Item"></label>
					<div class="uk-form-controls" id="form-item-modal-item"></div>
				</div>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-item-modal-nbt" lang="Edit.Criteria.Item.NBT"></label>
					<div class="uk-form-controls">
						<input class="uk-input" id="form-item-modal-nbt" type="text">
					</div>
				</div>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-item-modal-data" lang="Edit.Criteria.Item.Data"></label>
					<div class="uk-form-controls">
						<input class="uk-input" id="form-item-modal-data" type="number" min="0">
					</div>
				</div>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-item-modal-tag" lang="Edit.Criteria.Item.Tag"></label>
					<div class="uk-form-controls">
						<input class="uk-input" id="form-item-modal-tag" type="text">
					</div>
				</div>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-item-modal-count" lang="Edit.Criteria.Item.Count"></label>
					<div class="uk-form-controls" id="form-item-modal-count">
						<div class="min-max-form">
							<label for="form-item-modal-count-min" lang="Edit.Criteria.Item.Minimum"></label>
							<input class="uk-input uk-form-width-small" id="form-item-modal-count-min" type="number" min="0">
						</div>
						<div class="min-max-form">
							<label for="form-item-modal-count-max" lang="Edit.Criteria.Item.Maximum"></label>
							<input class="uk-input uk-form-width-small" id="form-item-modal-count-max" type="number" min="0">
						</div>
					</div>
				</div>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-item-modal-durability" lang="Edit.Criteria.Item.Durability"></label>
					<div class="uk-form-controls" id="form-item-modal-durability">
						<div class="min-max-form">
							<label for="form-item-modal-durability-min" lang="Edit.Criteria.Item.Minimum"></label>
							<input class="uk-input uk-form-width-small" id="form-item-modal-durability-min" type="number" min="0">
						</div>
						<div class="min-max-form">
							<label for="form-item-modal-durability-max" lang="Edit.Criteria.Item.Maximum"></label>
							<input class="uk-input uk-form-width-small" id="form-item-modal-durability-max" type="number" min="0">
						</div>
					</div>
				</div>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-item-modal-potion" lang="Edit.Criteria.Item.Potion"></label>
					<div class="uk-form-controls" id="form-item-modal-potion"></div>
				</div>
				<div class="uk-margin">
					<h3 class="uk-heading-line">
						<span lang="Edit.Criteria.Item.Enchantments"></span>
					</h3>
					<div id="form-item-modal-enchantements-list"></div>
					<button id="form-item-modal-add-enchantements" class="uk-button uk-button-primary uk-width-1-1">
						<span uk-icon="icon: plus"></span>
					</button>
				</div>
				<div class="uk-margin">
					<h3 class="uk-heading-line">
						<span lang="Edit.Criteria.Item.StoredEnchantments"></span>
					</h3>
					<div id="form-item-modal-stored-enchantements-list"></div>
					<button id="form-item-modal-add-stored-enchantements" class="uk-button uk-button-primary uk-width-1-1">
						<span uk-icon="icon: plus"></span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
`;

exports.enchantementBlock = (ID, type) => `
<button id="form-item-modal-${type}-list-${ID}-close" class="uk-button uk-button-link criteria-close-button">
	<span uk-icon="close"></span>
</button>
<div class="uk-margin">
	<label class="uk-form-label" for="form-item-modal-${type}-list-${ID}-search" lang="Edit.Criteria.Item.Enchantment"></label>
	<div class="uk-form-controls" id="form-item-modal-${type}-list-${ID}-search"></div>
</div>
<div class="uk-margin">
	<label class="uk-form-label" for="form-item-modal-${type}-list-${ID}-level" lang="Edit.Criteria.Item.Levels"></label>
	<div class="uk-form-controls" id="form-item-modal-${type}-list-${ID}-level">
		<div class="min-max-form">
			<label for="form-item-modal-${type}-list-${ID}-level-min" lang="Edit.Criteria.Item.Minimum"></label>
			<input class="uk-input uk-form-width-small" id="form-item-modal-${type}-list-${ID}-level-min" type="number" step="1">
		</div>
		<div class="min-max-form">
			<label for="form-item-modal-${type}-list-${ID}-level-max" lang="Edit.Criteria.Item.Maximum"></label>
			<input class="uk-input uk-form-width-small" id="form-item-modal-${type}-list-${ID}-level-max" type="number" step="1">
		</div>
	</div>
</div>
`;

exports.entityModal = (ID) => `
<div class="uk-margin">
	<button class="uk-button uk-button-primary uk-width-1-1" type="button" uk-toggle="target: #form-entity-modal-${ID}">
		<span uk-icon="pencil"></span>
		<span lang="Edit.Criteria.Entity.EditEntity"></span>
	</button>
</div>
<div id="form-entity-modal-container-${ID}">
	<div id="form-entity-modal-${ID}" class="uk-flex-top uk-modal" container="form-entity-modal-container-${ID}" uk-modal="bg-close:true;stack:true;">
		<div class="uk-modal-dialog uk-margin-auto-vertical" uk-overflow-auto>
			<div class="uk-modal-header">
				<h2 class="uk-modal-title" lang="Edit.Criteria.Entity.EditEntity"></h2>
			</div>
			<div class="uk-modal-body">
				<button class="uk-modal-close-default" type="button" uk-close></button>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-entity-modal-entity" lang="Edit.Criteria.Entity.Entity"></label>
					<div class="uk-form-controls" id="form-entity-modal-entity"></div>
				</div>
				<div class="uk-margin">
					<label class="uk-form-label" for="form-entity-modal-nbt" lang="Edit.Criteria.Entity.NBT"></label>
					<div class="uk-form-controls">
						<input class="uk-input" id="form-entity-modal-nbt" type="text">
					</div>
				</div>
				<div class="uk-margin uk-flex uk-flex-left uk-flex-between">
					<label>
						<input class="uk-checkbox" id="form-entity-modal-check-baby" type="checkbox">
						<span lang="Edit.Criteria.Entity.Flags.Baby"></span>
					</label>
					<label>
						<input class="uk-checkbox" id="form-entity-modal-check-fire" type="checkbox">
						<span lang="Edit.Criteria.Entity.Flags.Fire"></span>
					</label>
					<label>
						<input class="uk-checkbox" id="form-entity-modal-check-sneak" type="checkbox">
						<span lang="Edit.Criteria.Entity.Flags.Sneak"></span>
					</label>
					<label>
						<input class="uk-checkbox" id="form-entity-modal-check-sprint" type="checkbox">
						<span lang="Edit.Criteria.Entity.Flags.Sprint"></span>
					</label>
					<label>
						<input class="uk-checkbox" id="form-entity-modal-check-swim" type="checkbox">
						<span lang="Edit.Criteria.Entity.Flags.Swim"></span>
					</label>
				</div>

				<div class="uk-margin">
					<h4 class="uk-heading-line">
						<span lang="Edit.Criteria.Entity.Equipement.Equipement"></span>
					</h4>
					<div class="uk-flex uk-flex-left uk-flex-top uk-flex-row uk-flex-nowrap">
						<div id="form-entity-modal-switcher-body" class="body-selection">
							<img class="head" src="./dist/img/assets/body/head.webp"/>
							<div class="top">
								<img class="hand main-hand" src="./dist/img/assets/body/hand.webp"/>
								<img class="chest" src="./dist/img/assets/body/chest.webp"/>
								<img class="hand off-hand" src="./dist/img/assets/body/hand.webp"/>
							</div>
							<img class="legs" src="./dist/img/assets/body/legs.webp"/>
							<img class="feets" src="./dist/img/assets/body/feets.webp"/>
						</div>
						<div id="form-entity-modal-switcher" class="body-form">
							<div class="body-tab" id="form-entity-modal-switcher-head">
								head
							</div>
							<div class="body-tab" id="form-entity-modal-switcher-main-hand">
								main head
							</div>
							<div class="body-tab" id="form-entity-modal-switcher-chest">
								chest
							</div>
							<div class="body-tab" id="form-entity-modal-switcher-off-hand">
								off hand
							</div>
							<div class="body-tab" id="form-entity-modal-switcher-legs">
								legs
							</div>
							<div class="body-tab" id="form-entity-modal-switcher-feets">
								feets
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>
</div>
`;
