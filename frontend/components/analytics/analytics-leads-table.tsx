"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

type AnalyticsLeadsTableProps = {
  attempts: any[]
}

export default function AnalyticsLeadsTable({ attempts }: AnalyticsLeadsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter and sort attempts
  const filteredAttempts = attempts
    .filter((attempt) => {
      if (!searchTerm) return true

      // Search in answers (simplified - in real app would be more sophisticated)
      const answersStr = JSON.stringify(attempt.answers).toLowerCase()
      return answersStr.includes(searchTerm.toLowerCase())
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  // Paginate
  const totalPages = Math.ceil(filteredAttempts.length / itemsPerPage)
  const paginatedAttempts = filteredAttempts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Extract contact info from answers (simplified)
  const getContactInfo = (answers: Record<string, any>) => {
    // In a real app, you would have logic to identify fields that contain contact info
    const mockData = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 555-123-4567",
    }

    return mockData
  }

  // Determine if lead has valid contact info
  const isValidLead = (attempt: any) => {
    // In a real app, you would validate the contact info
    return true
  }

  if (attempts.length === 0) {
    return <div className="text-center py-8 text-gray-500">No leads collected yet.</div>
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAttempts.map((attempt) => {
              const contactInfo = getContactInfo(attempt.answers)
              const valid = isValidLead(attempt)

              return (
                <TableRow key={attempt.id}>
                  <TableCell className="font-medium">{format(new Date(attempt.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>{contactInfo.name}</TableCell>
                  <TableCell>{contactInfo.email}</TableCell>
                  <TableCell>{contactInfo.phone}</TableCell>
                  <TableCell>
                    {attempt.result_node_id ? (
                      <span className="text-xs">Result #{attempt.result_node_id.substring(0, 6)}</span>
                    ) : (
                      <span className="text-xs text-gray-500">No result</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {valid ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Valid
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        Incomplete
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}

            {paginatedAttempts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No matching leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredAttempts.length)} of {filteredAttempts.length} leads
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
