import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { DeliverServiceService, CreateDeliveryDriverDto, UpdateDeliveryDriverDto } from './deliver-service.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('delivery-drivers')
@Controller('delivery-drivers')
export class DeliverServiceController {
  constructor(private readonly deliverServiceService: DeliverServiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new delivery driver' })
  @ApiResponse({ status: 201, description: 'The delivery driver has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'User with this email already exists.' })
  @ApiBody({ type: CreateDeliveryDriverDto })
  @HttpCode(HttpStatus.CREATED)
  async createDeliveryDriver(@Body() createDto: CreateDeliveryDriverDto) {
    return this.deliverServiceService.createDeliveryDriver(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all delivery drivers' })
  @ApiResponse({ status: 200, description: 'Return all delivery drivers.' })
  async getAllDeliveryDrivers() {
    return this.deliverServiceService.getAllDeliveryDrivers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a delivery driver by ID' })
  @ApiParam({ name: 'id', description: 'Delivery driver ID' })
  @ApiResponse({ status: 200, description: 'Return the delivery driver.' })
  @ApiResponse({ status: 404, description: 'Delivery driver not found.' })
  async getDeliveryDriverById(@Param('id') id: string) {
    return this.deliverServiceService.getDeliveryDriverById(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a delivery driver' })
  @ApiParam({ name: 'id', description: 'Delivery driver ID' })
  @ApiBody({ type: UpdateDeliveryDriverDto })
  @ApiResponse({ status: 200, description: 'The delivery driver has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Delivery driver not found.' })
  @ApiResponse({ status: 409, description: 'Email is already in use.' })
  async updateDeliveryDriver(
    @Param('id') id: string,
    @Body() updateDto: UpdateDeliveryDriverDto,
  ) {
    return this.deliverServiceService.updateDeliveryDriver(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a delivery driver' })
  @ApiParam({ name: 'id', description: 'Delivery driver ID' })
  @ApiResponse({ status: 204, description: 'The delivery driver has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Delivery driver not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDeliveryDriver(@Param('id') id: string) {
    await this.deliverServiceService.deleteDeliveryDriver(+id);
  }

  @Get(':id/orders')
  @ApiOperation({ summary: 'Get orders for a delivery driver' })
  @ApiParam({ name: 'id', description: 'Delivery driver ID' })
  @ApiResponse({ status: 200, description: 'Return the delivery driver orders.' })
  @ApiResponse({ status: 404, description: 'Delivery driver not found.' })
  async getDeliveryDriverOrders(@Param('id') id: string) {
    return this.deliverServiceService.getDeliveryDriverOrders(+id);
  }
}
