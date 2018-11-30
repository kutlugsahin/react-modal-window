import classnames from 'classnames';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import styles from './styles.module.scss';

interface ModalProps {
	getParent: () => HTMLElement;
	isOpen: boolean;
	overlay: boolean;
	closeOnClickOut: boolean;
	draggable: boolean;
	maximizable: boolean;
	onClose: () => void;
	snapToWindow: boolean;
}

interface ModalState {
	maximized: boolean,
	render: boolean;
	windowTranslate: { x: number; y: number; }
	dragContext: DragContext | null;
}

interface DragContext {
	startPosition: { x: number; y: number };
	initialTranslation: { x: number; y: number };
	box: ClientRect | DOMRect | null;
}

class Modal extends Component<ModalProps, ModalState> {
	private domNode: Element | null = null;
	windowRef: React.RefObject<HTMLDivElement>;
	constructor(props: ModalProps) {
		super(props);
		this.getWindowTranslation = this.getWindowTranslation.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
		this.onDragStart = this.onDragStart.bind(this);
		this.onDragMove = this.onDragMove.bind(this);
		this.windowRef = React.createRef();
		this.state = {
			maximized: false,
			render: false,
			dragContext: null,
			windowTranslate: { x: 0, y: 0 },
		};
	}

	getParent() {
		return this.props.getParent ? this.props.getParent() : document.body;
	}

	appendToParent() {
		if (!this.domNode) {
			this.domNode = document.createElement('div');
			document.body.appendChild(this.domNode);
		}
	}

	componentWillUnmount() {
		if (this.domNode) {
			this.getParent().removeChild(this.domNode);
		}
	}

	getWindowTranslation() {
		const { windowTranslate } = this.state;

		if (windowTranslate) {
			const { x, y } = windowTranslate;

			return {
				left: `${x}px`,
				top: `${y}px`
			}
		}

		return {};
	}

	onDragStart(x: number, y: number) {
		if (this.props.draggable && !this.state.maximized) {
			this.setState({
				dragContext: {
					startPosition: { x, y },
					initialTranslation: { ...this.state.windowTranslate },
					box: this.windowRef.current ? this.windowRef.current.getBoundingClientRect() : null
				}
			});
		}
	}

	onDragMove(x: number, y: number) {
		if (this.state.dragContext) {
			const { startPosition, initialTranslation, box } = this.state.dragContext;

			const deltaX = x - startPosition.x;
			const deltaY = y - startPosition.y

			let newTranslationX = initialTranslation.x + deltaX;
			let newTranslationY = initialTranslation.y + deltaY;

			if (this.props.snapToWindow && box) {
				const translateMinX = 0 - box.left + initialTranslation.x;
				if (newTranslationX < translateMinX) newTranslationX = translateMinX;
				const translateMaxX = window.innerWidth - box.right + initialTranslation.x;
				if (newTranslationX > translateMaxX) newTranslationX = translateMaxX;
				const translateMinY = 0 - box.top + initialTranslation.y;
				if (newTranslationY < translateMinY) newTranslationY = translateMinY;
				const translateMaxY = window.innerHeight - box.bottom + initialTranslation.y;
				if (newTranslationY > translateMaxY) newTranslationY = translateMaxY;
			}

			this.setState({
				windowTranslate: {
					x: newTranslationX,
					y: newTranslationY,
				}
			})
		}
	}

	onDragEnd() {
		if (this.props.draggable) {
			this.setState({
				dragContext: null
			});
		}
	}

	renderModal() {
		if (this.state.render) {

			const modalClasses = classnames({
				[styles.modal]: true,
				[styles.close]: !this.props.isOpen,
			})
			const overlayClasses = classnames({
				[styles.overlay]: true,
			});

			const windowClasses = classnames({
				[styles.window]: true,
				[styles.maximize]: this.state.maximized,
				[styles.dragging]: !!this.state.dragContext,
			})

			const headerClasses = classnames({
				[styles.header]: true,
				[styles.draggable]: this.props.draggable,
			})

			return (
				<div
					className={modalClasses}
					onMouseMove={event => this.onDragMove(event.clientX, event.clientY)}
					onMouseUp={this.onDragEnd}
				>
					{this.props.overlay && <div className={overlayClasses} onClick={this.props.onClose} />}
					<div
						className={windowClasses}
						style={this.getWindowTranslation()}
						ref={this.windowRef}
					>
						<div className={headerClasses} onMouseDown={(event) => this.onDragStart(event.clientX, event.clientY)}>
							<button onClick={() => this.setState({ maximized: !this.state.maximized })}>Max</button>
						</div>
						<div className={styles.content}>
							<div>Hello</div>
							<div>Hello1</div>
							<div>Hello2</div>
							<div>Hello2</div>
							<div>Hello4</div>
							<div>Hello5</div>
							<div>Hello7</div>
							<div>Hello8</div>
							<div>Hello9</div>
							<div>Hellosdf</div>
							<div>Hellogg</div>
							<div>Hellohhh</div>
							<div>Hellohjg</div>
							<div>Hellogdfg</div>
							<div>Hello4565</div>
						</div>
						<div className={styles.footer}>
							<button>ok</button>
							<button>cencel</button>
						</div>
					</div>
				</div>
			);
		}

		return null;
	}

	componentDidUpdate(prevProps: ModalProps) {
		if (this.props.isOpen !== prevProps.isOpen) {
			if (!this.props.isOpen) {
				setTimeout(() => {
					this.setState({
						render: false,
						windowTranslate: { x: 0, y: 0 },
					})
				}, 200);
			} else {
				this.setState({
					render: true
				});
			}
		}
	}

	render() {
		if (!this.domNode) {
			this.appendToParent();
		}
		return ReactDom.createPortal(
			this.renderModal(),
			this.domNode || document.body,
		);
	}
}

export default Modal


