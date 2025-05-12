"use client"

import { useRef } from "react"
import QRCode from "qrcode.react"
import { toast } from "react-toastify"

const VoteReceipt = ({ receipt }) => {
  const receiptRef = useRef(null)

  const handlePrint = () => {
    const printContent = receiptRef.current.innerHTML
    const originalContent = document.body.innerHTML

    document.body.innerHTML = printContent
    window.print()
    document.body.innerHTML = originalContent

    window.location.reload()
  }

  const handleCopyTx = () => {
    navigator.clipboard.writeText(receipt.transactionHash)
    toast.success("Transaction hash copied to clipboard")
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div ref={receiptRef}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-1">Vote Receipt</h2>
          <p className="text-gray-600">Your vote has been recorded on the blockchain</p>
        </div>

        <div className="mb-6 flex justify-center">
          <QRCode value={`https://etherscan.io/tx/${receipt.transactionHash}`} size={150} renderAs="svg" />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Voter</h3>
            <p className="font-medium">{receipt.voter.name}</p>
            <p className="text-sm text-gray-600">
              NID: {receipt.voter.nidNumber.substring(0, 4)}****
              {receipt.voter.nidNumber.substring(receipt.voter.nidNumber.length - 4)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Party</h3>
            <p className="font-medium">{receipt.party.name}</p>
            <p className="text-sm text-gray-600">Party ID: {receipt.party.id}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Timestamp</h3>
            <p className="font-medium">{new Date(receipt.timestamp).toLocaleString()}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Transaction Hash</h3>
            <p className="text-xs font-mono bg-gray-100 p-2 rounded overflow-x-auto">{receipt.transactionHash}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handlePrint}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
        >
          Print Receipt
        </button>

        <button
          onClick={handleCopyTx}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md transition duration-200"
        >
          Copy TX Hash
        </button>
      </div>
    </div>
  )
}

export default VoteReceipt
