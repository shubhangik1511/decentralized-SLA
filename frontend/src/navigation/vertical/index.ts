// ** Icon imports
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline'
import FileSign from 'mdi-material-ui/FileSign'
import FileDocumentMultipleOutline from 'mdi-material-ui/FileDocumentMultipleOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/dashboard'
    },
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
      title: 'Contracts',
      icon: FileSign,
      path: '/contracts'
    },
    {
      sectionTitle: 'User Interface'
    },
    {
      title: 'Typography',
      icon: FormatLetterCase,
      path: '/typography'
    },
    {
      title: 'Icons',
      path: '/icons',
      icon: GoogleCirclesExtended
    },
    {
      title: 'Cards',
      icon: CreditCardOutline,
      path: '/cards'
    },
    {
      title: 'Tables',
      icon: Table,
      path: '/tables'
    },
    {
      icon: CubeOutline,
      title: 'Form Layouts',
      path: '/form-layouts'
    }
  ]
}

export default navigation
