//=============================================================================
// Etude87TitleSkip&LoadSavefile_1.1.0.js
//=============================================================================

/*:
 * @plugindesc 타이틀 스킵하고 바로 첫번째 세이브파일을 불러오는 플러그인 입니다.
 * @author 습작(習作, Etude87)
 *
  * @help
 *
 * 타이틀 스킵하고 바로 첫번째 세이브파일을 불러오는 플러그인 입니다. 세이브파일이 없는 경우 뉴 게임으로 연결됩니다.
 *
 */

(function() {
	Scene_Boot.prototype.start = function() {
		Scene_Base.prototype.start.call(this);
		SoundManager.preloadImportantSounds();
		if (DataManager.isBattleTest()) {
			DataManager.setupBattleTest();
			SceneManager.goto(Scene_Battle);
		} else if (DataManager.isEventTest()) {
			DataManager.setupEventTest();
			SceneManager.goto(Scene_Map);
		} else {
			this.checkPlayerLocation();
			DataManager.setupNewGame();
			if (DataManager.isAnySavefileExists()){
				DataManager.loadGame(1)
				if ($gameSystem.versionId() !== $dataSystem.versionId) {
						$gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
						$gamePlayer.requestMapReload();
				}
			};
			SceneManager.goto(Scene_Map);
			if (DataManager.isAnySavefileExists()){
				$gameSystem.onAfterLoad();
			};
		}
		this.updateDocumentTitle();
	};
})();