//=============================================================================
// MKMK_SaveManager.js
//=============================================================================
/*:
 * @plugindesc 게임의 저장 기능을 확장합니다.
 * @author MAKERMV.NET
 * 
 * @param < 심플 세이브 >
 * 
 * @param isSimpleSave
 * @desc 심플 세이브 기능을 사용할 수 있습니다.
 * -> 기본값 : false
 * @default false
 *
 * @param SimpleSaveIndex
 * @desc 심플 세이브 기능을 사용할 경우 저장될 파일의 번호를 입력하세요.
 * -> 기본값 : 1
 * @default 1
 *
 * @param
 * @param < 저장 기능 확장 >
 *
 * @param Row of Files
 * @desc 세이브 파일의 개수를 설정하세요. 기본값은 20개입니다.
 * -> 기본값 : 20
 * @default 20
 *
 * @help
 * 게임의 저장 기능을 확장하는 플러그인입니다.
 *
 * 플러그인 기능 안내 :
 *   -> isSimpleSave: 심플 세이브 기능의 사용을 설정할 수 있습니다.
 *   -> SimpleSaveIndex : 심플 세이브 기능을 사용할 경우 저장될 파일의 슬롯 번호입니다.
 *   -> Row of Files : 세이브/로드 파일 리스트의 개수입니다.
 *
 * Version 1.0.0
 * 제작일 : 2015/10/27
 * 제작자 : 포럼지기
 * 제작 사이트 : http://makermv.net (MKMV FORUM)
 */

var SaveManager = SaveManager || {} ;
var Parameters = PluginManager.parameters('MKMV_SaveManager');
SaveManager.isSimpleSave = Boolean(Parameters['isSimpleSave'] == 'true' || false);
SaveManager.simpleSaveIndex = Number(Parameters['SimpleSaveIndex'] || 1);
SaveManager.rowOfFiles = Number(Parameters['Row of Files'] || 20);

Scene_Menu.prototype.commandSave = function() {
	if(SaveManager.isSimpleSave == true) {
		$gameSystem.onBeforeSave();
		DataManager.saveGame(SaveManager.simpleSaveIndex);
		this._commandWindow.activate();
	} else {
		SceneManager.push(Scene_Save);
	}
};

DataManager.maxSavefiles = function() {
    return SaveManager.rowOfFiles;
};