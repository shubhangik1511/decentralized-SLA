// ** Icon imports
import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline'
import FileSign from 'mdi-material-ui/FileSign'
import FileDocumentMultipleOutline from 'mdi-material-ui/FileDocumentMultipleOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const Navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'New SLA',
      icon: PlusCircleOutline,
      path: '/create-sla'
    },
    {
      title: 'View SLAs',
      icon: FileDocumentMultipleOutline,
      path: '/view-sla'
    },
    {
      title: 'View Contracts',
      icon: FileSign,
      path: '/view-contracts'
    }
  ]
}

export default Navigation
