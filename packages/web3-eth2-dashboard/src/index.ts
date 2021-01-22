import { ETH2BeaconChain } from 'web3-eth2-beaconchain'
import { screen } from 'blessed'

import { readConfig } from './helpers/readConfigFile'
import { guiConfig } from '../types/index'
import { BottomContainerBox } from './views/validator/bottomBox/container'
import { ValidatorInfoBox } from './views/validator/info'
import { ValidatorIncomeBox } from './views/validator/income'
import { ValidatorBalanceHistoryBox } from './views/validator/balanceHistory'
import { ValidatorProposalsHeaderBox } from './views/validator/proposals/header'
import { ValidatorProposalsTable } from './views/validator/proposals/table'
import { ValidatorAttestationsHeaderBox } from './views/validator/attestations/header'
import { ValidatorAttestationsTable } from './views/validator/attestations/table'
import { ValidatorTable } from './views/validator/selection'

class Eth2Dashboard {
    config: guiConfig
    connected: boolean = false
    bottomContainerBox: any
    eth2BeaconChain: ETH2BeaconChain | undefined
    screenInstance: any
    validatorInfoBox: any
    validatorIncomeBox: any
    validatorBalanceHistoryBox: any
    validatorsProposalHeaderBox: any
    validatorProposalsTable: any
    validatorAttestationsHeaderBox: any
    validatorAttestationsTable: any
    validatorTable: any

    constructor(config: guiConfig) {
        this.config = config
        this.connectToProvider()
    }

    connectToProvider() {
        if (this.eth2BeaconChain === undefined) {
            this.eth2BeaconChain = new ETH2BeaconChain(this.config.httpProvider)
            if (!this.eth2BeaconChain) {
                this.connected = false
                return
            }
            this.eth2BeaconChain.addBlockExplorerApi()
            this.connected = true
        }
    }

    initScreen() {
        if (this.screenInstance === undefined) {
            this.screenInstance = screen({smartCSR: true})
            this.screenInstance.title = 'Web3Eth2Dashboard'
        }
    }

    initBottomContainerBox() {
        if (this.bottomContainerBox === undefined) {
            this.bottomContainerBox = new BottomContainerBox(this.config.httpProvider, this.connected)
        }
    }

    initValidatorInfoBox() {
        if (this.validatorInfoBox === undefined) {
            this.validatorInfoBox = new ValidatorInfoBox(this.eth2BeaconChain)
        }
    }

    initValidatorIncomeBox() {
        if (this.validatorIncomeBox === undefined) {
            this.validatorIncomeBox = new ValidatorIncomeBox(this.eth2BeaconChain)
        }
    }

    initValidatorBalanceHistoryBox() {
        if (this.validatorBalanceHistoryBox === undefined) {
            this.validatorBalanceHistoryBox = new ValidatorBalanceHistoryBox(this.eth2BeaconChain)
        }
    }

    initValidatorProposalsHeaderBox() {
        if (this.validatorsProposalHeaderBox === undefined) {
            this.validatorsProposalHeaderBox = new ValidatorProposalsHeaderBox()
        }
    }

    initValidatorProposalsTable() {
        if (this.validatorProposalsTable === undefined) {
            this.validatorProposalsTable = new ValidatorProposalsTable(this.eth2BeaconChain)
        }
    }

    initValidatorAttestationsHeaderBox() {
        if (this.validatorAttestationsHeaderBox === undefined) {
            this.validatorAttestationsHeaderBox = new ValidatorAttestationsHeaderBox()
        }
    }

    initValidatorAttestationsTable() {
        if (this.validatorAttestationsTable === undefined) {
            this.validatorAttestationsTable = new ValidatorAttestationsTable(this.eth2BeaconChain)
        }
    }

    initValidatorTable() {
        if (this.validatorInfoBox !== undefined && this.validatorTable === undefined) {
            this.validatorTable = new ValidatorTable(
                this.screenInstance,
                this.validatorInfoBox,
                this.validatorIncomeBox,
                this.validatorBalanceHistoryBox,
                this.validatorProposalsTable,
                this.validatorAttestationsTable,
                this.config.validators)
        }
    }

    drawGui() {
        if (this.screenInstance === undefined) {
            this.initScreen()
            this.initBottomContainerBox()
            this.initValidatorInfoBox()
            this.initValidatorIncomeBox()
            this.initValidatorBalanceHistoryBox()
            this.initValidatorProposalsHeaderBox()
            this.initValidatorProposalsTable()
            this.initValidatorAttestationsHeaderBox()
            this.initValidatorAttestationsTable()
            this.initValidatorTable()

            // Quit on Escape, q, or Control-C.
            this.screenInstance.key(['escape', 'q', 'C-c'], () => process.exit(0))
            this.screenInstance.append(this.bottomContainerBox.rawElement)
            this.screenInstance.append(this.validatorInfoBox.rawElement)
            this.screenInstance.append(this.validatorIncomeBox.rawElement)
            this.screenInstance.append(this.validatorBalanceHistoryBox.rawElement)
            this.screenInstance.append(this.validatorsProposalHeaderBox.rawElement)
            this.screenInstance.append(this.validatorProposalsTable.rawElement)
            this.screenInstance.append(this.validatorAttestationsHeaderBox.rawElement)
            this.screenInstance.append(this.validatorAttestationsTable.rawElement)
            this.screenInstance.append(this.validatorTable.rawElement)
            this.screenInstance.render()
        }
    }
}

(() => {
    try {
        const config = readConfig()
        if (config === undefined) throw Error('Unable to load config file')
        const eth2Dashboard = new Eth2Dashboard(config)
        eth2Dashboard.drawGui()
    } catch (error) {
        console.error(error)
    }
})()
