import {
	JupyterFrontEnd, JupyterFrontEndPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
	ICommandPalette, MainAreaWidget, WidgetTracker
} from '@jupyterlab/apputils';

import {
	IMainMenu
} from '@jupyterlab/mainmenu';

import {
	Widget
} from '@phosphor/widgets';


const URL = 'https://lab.eucp-project.eu/help/';


class EUCPHelpWidget extends Widget {

	constructor() {
		super();

		this.addClass('eucp-help');

		this.iframe = document.createElement('iframe');
		this.iframe.className += ' eucp-help';
		this.iframe.src = URL;
		this.node.appendChild(this.iframe);
	}

	readonly iframe: HTMLIFrameElement;
}


function activate(app: JupyterFrontEnd, palette: ICommandPalette, mainmenu: IMainMenu, restorer: ILayoutRestorer) {

	let widget: MainAreaWidget<EUCPHelpWidget>;

	const command: string = 'eucp-help:open';
	app.commands.addCommand(command, {
		label: 'EUCP Help',
		execute: () => {
			if (!widget) {
				const content = new EUCPHelpWidget();
				widget = new MainAreaWidget({content});
				widget.id = 'eucp-help';
				widget.title.label = 'EUCP Help'
				widget.title.closable = true;
			}
			if (!tracker.has(widget)) {
				tracker.add(widget);
			}
			if (!widget.isAttached) {
				app.shell.add(widget, 'main');
			}
			widget.content.update();

			app.shell.activateById(widget.id);
		}
	});
	palette.addItem({command, category: 'EUCP Help'});

	mainmenu.helpMenu.addGroup([
		{
			command,
		},
	], 40);

	let tracker = new WidgetTracker<MainAreaWidget<EUCPHelpWidget>> ({
		namespace: 'eucp-help'
	});
	restorer.restore(tracker, {
		command,
		name: () => 'eucp-help'
	});
}


const extension: JupyterFrontEndPlugin<void> = {
	id: 'eucp-help',
	autoStart: true,
	requires: [ICommandPalette, IMainMenu, ILayoutRestorer],
	activate: activate
};


export default extension;
