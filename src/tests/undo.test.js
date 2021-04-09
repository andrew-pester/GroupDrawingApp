import { mount } from 'enzyme'
import { CanvasPage } from '../CanvasPage'
import { UndoPanel } from '../UndoPanel'

describe('Undo', () => {
    it('Undoes an action', () => {
        const wrapper = mount(<CanvasPage />)
        wrapper.find(UndoPanel).at(0).find('button').at(0).simulate('click')
        expect(wrapper.props.canvasEvents.length == 0)
    })
})