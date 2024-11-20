'use client'

import { usePointMe } from '../../../lib/hooks'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

export default function BusinessOversight() {
  const { businesses, loading, error, updateBusinessStatus } = usePointMe()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell>{business.name}</TableCell>
                  <TableCell>{business.email}</TableCell>
                  <TableCell>{business.status}</TableCell>
                  <TableCell>{business.category}</TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      {business.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateBusinessStatus(business.id, 'active')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => updateBusinessStatus(business.id, 'inactive')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {business.status === 'active' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => updateBusinessStatus(business.id, 'inactive')}
                        >
                          Suspend
                        </Button>
                      )}
                      {business.status === 'inactive' && (
                        <Button
                          size="sm"
                          onClick={() => updateBusinessStatus(business.id, 'active')}
                        >
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 